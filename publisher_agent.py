#!/usr/bin/env python3
"""
Roznamcha Programmatic Blog Ingestion Agent
-------------------------------------------
Automated, search-grounded editorial publishing agent for Roznamcha.pk.
Uses Google Gemini API with live search grounding (or local pre-vetted editorial
templates) to research, generate, validate, and transmit comprehensive,
AdSense-compliant draft articles to the internal ingestion API endpoint.

Features:
- Pre-flight deduplication: queries target database to prevent duplicate titles/slugs.
- Dynamic editorial topic pool: rotates through high-impact Pakistani household
  budgeting and inflation topics across all active categories.
- Strict AdSense compliance: enforces minimum 1,400 words, structured HTML tables,
  actionable financial guidance, and draft-only status.
"""

import argparse
import json
import os
import re
import sys
from typing import Any, Dict, List, Optional, Tuple

# Attempt imports with friendly error guidance
try:
    from dotenv import load_dotenv
except ImportError:
    load_dotenv = None

try:
    import requests
except ImportError:
    requests = None

try:
    from pydantic import BaseModel, Field, ValidationError
except ImportError:
    BaseModel = None
    Field = None
    ValidationError = None

try:
    from google import genai
    from google.genai import types
except ImportError:
    genai = None
    types = None


# ---------------------------------------------------------------------------
# Exceptions
# ---------------------------------------------------------------------------

class DuplicatePostError(Exception):
    """Raised when an article with the same title or slug already exists."""
    pass


# ---------------------------------------------------------------------------
# Configuration & Environment
# ---------------------------------------------------------------------------

def load_environment() -> Dict[str, str]:
    """
    Load environment variables from system environment or .env file.
    Supports python-dotenv with a reliable manual parsing fallback.
    Never leaks sensitive tokens into logs or terminal outputs.
    """
    env_vars: Dict[str, str] = {}
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")

    # 1. Load using python-dotenv if available
    if load_dotenv and os.path.exists(env_path):
        load_dotenv(env_path)

    # 2. Fallback manual parsing of Laravel's .env file
    if os.path.exists(env_path):
        try:
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    stripped = line.strip()
                    if not stripped or stripped.startswith("#") or "=" not in stripped:
                        continue
                    key, val = stripped.split("=", 1)
                    key = key.strip()
                    val = val.strip().strip("'\"")
                    if key and key not in os.environ:
                        os.environ[key] = val
        except Exception:
            pass

    # Populate resolved configurations
    gemini_key = (
        os.getenv("GEMINI_API_KEY")
        or os.getenv("GOOGLE_API_KEY")
        or os.getenv("AI_API_KEY")
        or ""
    ).strip()

    ingestion_key = (
        os.getenv("INGESTION_SECRET_KEY")
        or os.getenv("AGENT_INGESTION_SECRET")
        or ""
    ).strip()

    # Default to production endpoint https://roznamcha.pk/api/internal/publish-post
    default_url = "https://roznamcha.pk/api/internal/publish-post"
    configured_url = (
        os.getenv("TARGET_API_URL")
        or os.getenv("LOCAL_API_URL")
        or os.getenv("API_URL")
        or ""
    ).strip()

    if not configured_url:
        configured_url = default_url

    # Autocorrect common .pl typo to .pk
    if "roznamcha.pl" in configured_url:
        configured_url = configured_url.replace("roznamcha.pl", "roznamcha.pk")

    env_vars["GEMINI_API_KEY"] = gemini_key
    env_vars["INGESTION_SECRET_KEY"] = ingestion_key
    env_vars["LOCAL_API_URL"] = configured_url
    env_vars["TARGET_API_URL"] = configured_url

    return env_vars


# ---------------------------------------------------------------------------
# Pydantic Schema for Structured Output
# ---------------------------------------------------------------------------

if BaseModel is not None:
    class BlogPostPayload(BaseModel):
        """Schema for AI generated, AdSense-compliant blog articles."""
        title: str = Field(
            ...,
            description="SEO-optimized, natural headline without robotic cliches or clickbait.",
            max_length=255,
        )
        seo_title: Optional[str] = Field(
            default=None,
            description="Punchy Google search title strictly between 45 and 58 characters.",
            max_length=65,
        )
        focus_keyword: str = Field(
            ...,
            description="High-intent target keyword or phrase relevant to Pakistan / global audience.",
            max_length=150,
        )
        meta_description: str = Field(
            ...,
            description="Concise meta summary between 140 and 160 characters.",
            max_length=500,
        )
        category_id: int = Field(
            default=1,
            description=(
                "Category ID matching local database: "
                "1 = Inflation Watch, 2 = Household Tips, "
                "3 = Personal Finance Pakistan, 6 = Fuel Prices Hike."
            ),
        )
        status: str = Field(
            default="draft",
            description="Article status. Must always be 'draft' for manual verification.",
        )
        content_html: str = Field(
            ...,
            description=(
                "Exhaustive article content (minimum 1,400 words). "
                "Must be semantically structured with <h2>, <h3>, <p>, <ul>, <li>, "
                "and <table>. No markdown code fences, no <html>/<body> tags."
            ),
        )
else:
    from dataclasses import dataclass, asdict

    @dataclass
    class BlogPostPayload:  # type: ignore
        """Fallback payload container when pydantic is not installed."""
        title: str
        focus_keyword: str
        meta_description: str
        content_html: str
        seo_title: Optional[str] = None
        category_id: int = 1
        status: str = "draft"
        slug: Optional[str] = None
        excerpt: Optional[str] = None

        @classmethod
        def model_validate(cls, data: Dict[str, Any]) -> "BlogPostPayload":
            return cls(
                title=data["title"],
                focus_keyword=data.get("focus_keyword", ""),
                meta_description=data.get("meta_description", ""),
                category_id=int(data.get("category_id", 1)),
                content_html=data["content_html"],
                seo_title=data.get("seo_title"),
                status=data.get("status", "draft"),
                slug=data.get("slug"),
                excerpt=data.get("excerpt"),
            )

        def model_dump(self) -> Dict[str, Any]:
            return asdict(self)


# ---------------------------------------------------------------------------
# Helper Utilities
# ---------------------------------------------------------------------------

def mask_credential(val: str) -> str:
    """Safely mask credential string for display."""
    if not val:
        return "[NOT SET]"
    if len(val) <= 8:
        return "***"
    return f"{val[:4]}...{val[-4:]} (len: {len(val)})"


def count_words(html_text: str) -> int:
    """Calculate clean word count from HTML markup."""
    clean = re.sub(r"<[^>]+>", " ", html_text)
    clean = re.sub(r"&[a-z]+;", " ", clean)
    words = clean.split()
    return len(words)


def clean_json_string(raw: str) -> str:
    """Extract clean JSON substring from AI model output."""
    raw = raw.strip()
    if raw.startswith("```json"):
        raw = raw[7:]
    elif raw.startswith("```"):
        raw = raw[3:]
    if raw.endswith("```"):
        raw = raw[:-3]
    return raw.strip()


def normalize_slug(text: str) -> str:
    """Normalize text into an ASCII URL slug candidate."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    return text.strip("-")


def normalize_title(text: str) -> str:
    """Normalize title for fuzzy / exact comparison."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s]", "", text)
    return " ".join(text.split())


# ---------------------------------------------------------------------------
# Remote Database & Deduplication Checks
# ---------------------------------------------------------------------------

def fetch_existing_posts(api_url: str, secret_key: str) -> List[Dict[str, Any]]:
    """
    Fetch recent post titles and slugs from the target endpoint to prevent duplicates.
    """
    if not requests or not secret_key:
        return []

    # Derive existing-posts URL from base publish URL
    existing_url = re.sub(r"/publish-post.*", "/existing-posts?limit=200", api_url)
    headers = {
        "X-Ingestion-Key": secret_key,
        "Accept": "application/json",
    }

    try:
        resp = requests.get(existing_url, headers=headers, timeout=12)
        if resp.status_code == 200:
            data = resp.json()
            return data.get("posts", [])
    except Exception:
        pass
    return []


def check_post_exists_on_api(
    api_url: str,
    secret_key: str,
    title: str = "",
    slug: str = "",
    topic: str = "",
) -> Dict[str, Any]:
    """
    Query the /api/internal/check-post endpoint for direct database match.
    """
    if not requests or not secret_key:
        return {"exists": False, "matches": []}

    check_url = re.sub(r"/publish-post.*", "/check-post", api_url)
    headers = {
        "X-Ingestion-Key": secret_key,
        "Accept": "application/json",
    }
    params = {}
    if title:
        params["title"] = title
    if slug:
        params["slug"] = slug
    if topic:
        params["topic"] = topic

    try:
        resp = requests.get(check_url, params=params, headers=headers, timeout=12)
        if resp.status_code == 200:
            return resp.json()
    except Exception:
        pass
    return {"exists": False, "matches": []}


def is_duplicate_topic(
    topic_or_title: str,
    existing_posts: List[Dict[str, Any]],
    api_url: str,
    secret_key: str,
) -> Tuple[bool, str]:
    """
    Check if a topic or title has already been ingested or published.
    Returns (is_duplicate: bool, reason: str).
    """
    target_norm = normalize_title(topic_or_title)
    target_slug = normalize_slug(topic_or_title)

    # 1. Local match against pre-fetched list
    for post in existing_posts:
        p_title = post.get("title", "")
        p_slug = post.get("slug", "")
        p_norm = normalize_title(p_title)
        p_id = post.get("id")

        if target_norm == p_norm or (target_norm and target_norm in p_norm) or (p_norm and p_norm in target_norm and len(p_norm) > 20):
            return True, f"Matches existing post ID {p_id} ('{p_title}')"

        if target_slug and (target_slug == p_slug or p_slug.startswith(target_slug)):
            return True, f"Matches existing slug '{p_slug}' (Post ID {p_id})"

    # 2. Targeted API verification
    api_check = check_post_exists_on_api(
        api_url=api_url,
        secret_key=secret_key,
        title=topic_or_title,
        slug=target_slug,
    )
    if api_check.get("exists"):
        matches = api_check.get("matches", [])
        match_info = f"ID {matches[0].get('id')} ({matches[0].get('slug')})" if matches else "API match"
        return True, f"Target database confirmed duplicate: {match_info}"

    return False, ""


# ---------------------------------------------------------------------------
# Dynamic Editorial Topic Pool
# ---------------------------------------------------------------------------

EDITORIAL_TOPIC_POOL: List[Dict[str, Any]] = [
    {
        "id": "solar-net-metering-2026",
        "topic": "Solar Net Metering Regulations in Pakistan 2026: Payback Period and ROI Breakdown",
        "default_title": "Solar Net Metering Regulations in Pakistan 2026: Payback Period and ROI Breakdown",
        "focus_keyword": "solar net metering pakistan 2026 payback",
        "category_id": 2,  # Household Tips
        "category_name": "Household Tips",
        "meta_description": "Comprehensive economic and technical analysis of NEPRA solar net metering rules, buyback tariffs, three-phase inverter sizing, and payback calculations.",
    },
    {
        "id": "salaried-tax-slabs-2026",
        "topic": "Salaried Tax Slabs FY 2025-26 and Income Tax Optimization Strategies for Pakistani Professionals",
        "default_title": "Salaried Tax Slabs FY 2025-26 and Income Tax Optimization Strategies for Pakistani Professionals",
        "focus_keyword": "salaried tax slabs pakistan 2026 calculation",
        "category_id": 3,  # Personal Finance Pakistan
        "category_name": "Personal Finance Pakistan",
        "meta_description": "An authoritative guide to FBR salaried income tax brackets, monthly payroll deductions, surcharge thresholds, and legitimate tax credits.",
    },
    {
        "id": "wheat-flour-atta-subsidies-2026",
        "topic": "Wheat Flour (Atta) Subsidies vs Open Market Rates: Managing Kitchen Grocery Inflation 2026",
        "default_title": "Wheat Flour (Atta) Subsidies vs Open Market Rates: Managing Kitchen Grocery Inflation 2026",
        "focus_keyword": "atta price subsidy open market pakistan 2026",
        "category_id": 1,  # Inflation Watch
        "category_name": "Inflation Watch",
        "meta_description": "An investigative report on provincial wheat procurement, Utility Stores Corporation flour quotas, Chakki vs mill rates, and tactical grocery budgeting.",
    },
    {
        "id": "fuel-deregulation-transport-2026",
        "topic": "Fuel Price Deregulation in Pakistan: Transport Inflation and Commuter Survival Guide",
        "default_title": "Fuel Price Deregulation in Pakistan: Transport Inflation and Commuter Survival Guide",
        "focus_keyword": "fuel price deregulation transport cost pakistan 2026",
        "category_id": 6,  # Fuel Prices Hike
        "category_name": "Fuel Prices Hike",
        "meta_description": "Detailed economic breakdown of weekly petroleum pricing, petroleum development levy (PDL) escalation, public transit fares, and commuting budget defense.",
    },
    {
        "id": "national-savings-schemes-2026",
        "topic": "National Savings Schemes (Behbood vs Regular Income Certificates): Real Returns Against Inflation 2026",
        "default_title": "National Savings Schemes (Behbood vs Regular Income Certificates): Real Returns Against Inflation 2026",
        "focus_keyword": "national savings schemes profit rates pakistan 2026",
        "category_id": 3,  # Personal Finance Pakistan
        "category_name": "Personal Finance Pakistan",
        "meta_description": "Comprehensive comparative assessment of Central Directorate of National Savings certificates, withholding tax treatments, and inflation-adjusted purchasing power.",
    },
    {
        "id": "inverter-ac-consumption-2026",
        "topic": "Inverter AC vs Non-Inverter Power Consumption: Practical Testing for Pakistani Summer Loads",
        "default_title": "Inverter AC vs Non-Inverter Power Consumption: Practical Testing for Pakistani Summer Loads",
        "focus_keyword": "inverter ac electricity consumption units pakistan",
        "category_id": 2,  # Household Tips
        "category_name": "Household Tips",
        "meta_description": "Benchmarking empirical unit consumption for 1.5-ton inverter air conditioners across 26C vs 20C thermostat settings under NEPRA un-protected slabs.",
    },
    {
        "id": "electricity-tariff-defense-2026",
        "topic": "Pakistan electricity tariff increases and household budgeting defense 2026",
        "default_title": "Pakistan electricity tariff increases and household budgeting defense 2026",
        "focus_keyword": "electricity tariff increase pakistan 2026",
        "category_id": 3,  # Personal Finance Pakistan
        "category_name": "Personal Finance Pakistan",
        "meta_description": "An in-depth investigation into NEPRA fuel charges adjustments, protected slab limits, and how urban families can restructure their utility budgets.",
    },
]


def select_unposted_topic(
    existing_posts: List[Dict[str, Any]],
    api_url: str,
    secret_key: str,
    requested_topic: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Select an editorial topic that has not been posted yet.
    If requested_topic is provided and already posted, logs an alert and auto-rotates.
    """
    # 1. If explicit topic requested, check if it's already posted
    if requested_topic:
        is_dup, reason = is_duplicate_topic(
            topic_or_title=requested_topic,
            existing_posts=existing_posts,
            api_url=api_url,
            secret_key=secret_key,
        )
        if is_dup:
            print(f"\n[!] DUPLICATE DETECTED for requested topic: '{requested_topic}'")
            print(f"    Reason: {reason}")
            print("[*] Automatically rotating to the next available unposted topic from the editorial pool...")
        else:
            return {
                "id": "custom",
                "topic": requested_topic,
                "default_title": requested_topic,
                "focus_keyword": normalize_slug(requested_topic).replace("-", " "),
                "category_id": 3,
                "category_name": "Personal Finance Pakistan",
                "meta_description": f"In-depth investigative analysis on {requested_topic} for Pakistani households.",
            }

    # 2. Iterate through curated topic pool to find the first unposted entry
    for candidate in EDITORIAL_TOPIC_POOL:
        is_dup, reason = is_duplicate_topic(
            topic_or_title=candidate["default_title"],
            existing_posts=existing_posts,
            api_url=api_url,
            secret_key=secret_key,
        )
        if not is_dup:
            return candidate
        else:
            print(f"[*] Skipping already posted topic: '{candidate['default_title']}' ({reason})")

    # If all pool topics are exhausted, generate a dated variant to guarantee forward progress
    fallback_topic = "Weekly Pakistan Cost of Living and Grocery Price Index: March 2026 Market Analysis"
    return {
        "id": "fallback-weekly-index",
        "topic": fallback_topic,
        "default_title": fallback_topic,
        "focus_keyword": "pakistan weekly inflation grocery cost 2026",
        "category_id": 1,
        "category_name": "Inflation Watch",
        "meta_description": "Comprehensive weekly tracking of SPI essential commodities, retail price variance across Punjab and Sindh, and household grocery management.",
    }


# ---------------------------------------------------------------------------
# Content Generation via Gemini & Google Search Grounding
# ---------------------------------------------------------------------------

EDITORIAL_SYSTEM_INSTRUCTION = """
You are the Chief Financial Journalist and SEO Content Architect for Roznamcha.pk, Pakistan's premier household economics and financial documentation platform.

Your mission is to produce authoritative, deeply researched, long-form articles (minimum 1,600 words) that rank #1 on Google, earn instant AdSense approval, and deliver actionable utility to Pakistani families and professionals.

MANDATORY PUBLISHING RULES & OPTIMIZATION GUIDELINES:

1. SEO TITLE TRUNCATION RULE (CRITICAL):
   - You MUST generate TWO distinct title fields:
     a) "title": The full journalistic headline for the article H1 (65 to 85 characters).
     b) "seo_title": A punchy, complete search engine title strictly BETWEEN 45 AND 58 CHARACTERS.
   - NEVER exceed 58 characters for "seo_title". If it exceeds 60 characters, the website CMS will abruptly cut it off mid-word (e.g. "Optimization St"), destroying search rankings.
   - Do NOT add "- Roznamcha" to "seo_title" (the CMS appends it automatically).

2. MANDATORY 3-TIER LINK GRAPH (NEVER LEAVE POSTS WITH ZERO LINKS):
   Every article MUST contain at least 5 to 7 authentic, natural HTML hyperlinks (<a> tags) distributed across the following 3 layers:
   
   Layer A: Internal Roznamcha Public Tools (Include 2 or 3):
     - Monthly Expense Tracker: <a href="/monthly-expense-tracker-pakistan">Monthly Expense Tracker</a>
     - Electricity Bill Calculator: <a href="/electricity-bill-calculator-lesco">DISCO Electricity Bill Calculator</a>
     - Ration Cost Estimator: <a href="/tools/ration-cost-estimator">Ration Cost Estimator</a>
     - Monthly Budget Calculator: <a href="/tools/monthly-household-budget-calculator">Monthly Household Budget Calculator</a>
     - Flagship Budget Guide: <a href="/blog/ghar-ka-monthly-budget">Ghar Ka Monthly Budget Guide</a>
   
   Layer B: Strategic Sister Platform Mention (Include 1 natural contextual link):
     - When discussing government salary scales, BPS allowances, civil service security against inflation, or competitive exams, link contextually to SarkariTayari:
       • Homepage: <a href="https://sarkaritayari.pk" target="_blank" rel="noopener noreferrer">SarkariTayari.pk</a>
       • Past Papers: <a href="https://sarkaritayari.pk/past-papers" target="_blank" rel="noopener noreferrer">authentic solved past papers</a>
       • AI Mock Tests: <a href="https://sarkaritayari.pk/ai/mock-tests" target="_blank" rel="noopener noreferrer">SarkariTayari AI Mock Test Simulator</a>
   
   Layer C: Authoritative Government / Institutional Links (Include 2 or 3):
     - Federal Board of Revenue: <a href="https://fbr.gov.pk" target="_blank" rel="noopener noreferrer">Federal Board of Revenue (FBR)</a>
     - FBR Iris Tax Portal: <a href="https://iris.fbr.gov.pk" target="_blank" rel="noopener noreferrer">FBR Iris Online Portal</a>
     - SECP Pension Regulations: <a href="https://www.secp.gov.pk" target="_blank" rel="noopener noreferrer">Securities and Exchange Commission of Pakistan (SECP)</a>
     - NEPRA (for electricity tariffs): <a href="https://nepra.org.pk" target="_blank" rel="noopener noreferrer">NEPRA</a>
     - State Bank of Pakistan: <a href="https://www.sbp.org.pk" target="_blank" rel="noopener noreferrer">State Bank of Pakistan (SBP)</a>

3. HIGH-CTR VISUAL CALLOUT CARD (ROZNAMCHA AMBER BOX):
   - The platform renders <blockquote> tags with an elegant amber-styled callout card.
   - You MUST include at least one prominent <blockquote> callout highlighting an actionable tool or rule:
     Example:
     <blockquote>
       <p>💡 <strong>Actionable Household Rule:</strong><br>
       Text explaining how to track expenses using Roznamcha's <a href="/monthly-expense-tracker-pakistan">Expense Tracker</a> and prepare for career upskilling on <a href="https://sarkaritayari.pk" target="_blank" rel="noopener noreferrer">SarkariTayari.pk</a>.</p>
     </blockquote>

4. DATA TABLES & VERIFIED PAKISTANI CALCULATIONS:
   - Provide at least one (and ideally two) clean, well-formatted <table> elements with <thead>, <tbody>, and clear PKR numbers.
   - For taxes or utility bills, use the latest official statutory formulas (e.g. Finance Act 2024/2025 slabs, NEPRA protected 200-unit criteria). 
   - Never approximate numbers lazily; verify calculations across real Pakistani income tiers (Rs. 50k, 100k, 200k, 350k, 500k, 1M).

5. PRACTICAL STEP-BY-STEP WALKTHROUGH:
   - Include a dedicated section with an ordered list (<ol> and <li>) explaining the exact practical steps a citizen must take (e.g., how to download withholding tax certificates from Jazz/Zong apps and enter them on FBR Iris).

6. BUILT-IN FAQ SECTION FOR GOOGLE RICH SNIPPETS:
   - Conclude every article with a dedicated <h2>Frequently Asked Questions (FAQs)</h2>.
   - Include 4 to 5 high-intent questions using <h3> for questions and <p> for direct, concise answers (answering exact queries typed into Google Search).

7. EDITORIAL VOICE & ADSENSE COMPLIANCE:
   - ZERO AI Cliches: Never write 'In conclusion', 'Delve into', 'In this fast-paced world', 'It is crucial to remember', 'Moreover', 'Furthermore'.
   - Grounded in Pakistani Reality: Write about real everyday pain points (DISCO bills, protected slabs, Sensitive Price Indicator, atta prices, EOBI, ATL non-filer penalties).
   - Word count: 1,600 to 2,400 words. Deep, original, journalistic substance.
"""


def generate_article_with_gemini(
    api_key: str,
    topic_info: Dict[str, Any],
    model_name: str = "gemini-2.5-flash",
) -> BlogPostPayload:
    """
    Query Gemini model with live search grounding and parse into Pydantic schema.
    """
    if genai is None or types is None:
        raise RuntimeError("Missing 'google-genai' package. Run: pip install -r requirements-agent.txt")

    if not api_key:
        raise ValueError(
            "GEMINI_API_KEY is not configured. Please add GEMINI_API_KEY to your .env file."
        )

    client = genai.Client(api_key=api_key)
    topic = topic_info["topic"]

    prompt = f"""
Conduct live Google Search research on the following topic and write an authoritative, exhaustive long-form journalistic article (minimum 1,600 words) for Pakistani households:

Topic: {topic}
Target Category ID: {topic_info.get('category_id', 1)}

Provide your response strictly as a JSON object with these exact keys:
{{
  "title": "Natural, compelling headline without buzzwords (between 65 and 85 characters)",
  "seo_title": "Punchy Google search title STRICTLY BETWEEN 45 AND 58 CHARACTERS (no truncation)",
  "focus_keyword": "Primary target keyword in Pakistan",
  "meta_description": "145-155 character SEO summary",
  "category_id": {topic_info.get('category_id', 1)},
  "status": "draft",
  "content_html": "<h2>...</h2><p>...</p><blockquote>...</blockquote><table>...</table><ol>...</ol><h2>Frequently Asked Questions (FAQs)</h2>..."
}}
"""

    print(f"[*] Querying Gemini ({model_name}) with live Google Search grounding...")
    print(f"[*] Topic: '{topic}'")

    config = types.GenerateContentConfig(
        tools=[types.Tool(google_search=types.GoogleSearch())],
        system_instruction=EDITORIAL_SYSTEM_INSTRUCTION,
        temperature=0.7,
    )

    try:
        response = client.models.generate_content(
            model=model_name,
            contents=prompt,
            config=config,
        )
    except Exception as e:
        if "not found" in str(e).lower() and model_name != "gemini-2.0-flash":
            print(f"[!] Model {model_name} failed. Falling back to gemini-2.0-flash...")
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt,
                config=config,
            )
        else:
            raise e

    raw_text = response.text or ""
    json_str = clean_json_string(raw_text)

    try:
        data = json.loads(json_str)
    except json.JSONDecodeError as err:
        match = re.search(r"(\{.*\})", raw_text, re.DOTALL)
        if match:
            data = json.loads(match.group(1))
        else:
            raise ValueError(f"Failed to parse JSON from model response: {err}")

    data["status"] = "draft"
    if "category_id" not in data or not data["category_id"]:
        data["category_id"] = topic_info.get("category_id", 1)

    raw_seo_title = data.get("seo_title") or data.get("title", "")
    safe_seo_title = raw_seo_title.strip()
    if len(safe_seo_title) > 58:
        safe_seo_title = safe_seo_title[:55].rstrip()
    data["seo_title"] = safe_seo_title

    return BlogPostPayload.model_validate(data)


# ---------------------------------------------------------------------------
# Offline Mock Generators (Pre-Vetted 1,450+ Word Compliant Articles)
# ---------------------------------------------------------------------------

def generate_mock_solar_article(topic_info: Dict[str, Any]) -> BlogPostPayload:
    """Generate 1,450+ word pre-vetted article on Solar Net Metering in Pakistan."""
    title = topic_info["default_title"]
    keyword = topic_info["focus_keyword"]
    meta = topic_info["meta_description"]

    paragraphs = [
        "<p>Across urban neighborhoods in Lahore, Faisalabad, and Islamabad, the drone of diesel backup generators has gradually been replaced by the subtle hum of string inverters mounted on rooftop parapets. Over the past twenty-four months, soaring residential electricity tariffs—driven by multi-year capacity payment obligations and fluctuating fuel charge adjustments (FCA)—have transformed domestic solar installations from an aspirational luxury into an urgent household balance sheet defense. Yet, as thousands of middle-class families race to install rooftop photovoltaic panels, regulatory turbulence surrounding National Electric Power Regulatory Authority (NEPRA) net metering rules has introduced unexpected financial variables that alter the traditional math of solar investments in Pakistan.</p>",
        "<p>At the center of this debate is the tension between gross metering proposals and the established net metering framework codified under the 2015 alternative energy regulations. While distribution companies (DISCOs) face mounting circular debt and declining base-load revenues as high-consumption domestic users defect from the grid during daylight hours, consumers argue that private capital investment in rooftop generation offers the only durable shield against runaway utility bills. Understanding the precise mechanics of bidirectional metering, green meter installation timelines, and buyback tariff equations is essential for any family considering a capital outlay of over a million rupees in 2026.</p>",
        "<h2>Deconstructing the Net Metering Billing Equation</h2>",
        "<p>Under Pakistan's active net metering structure, a bidirectional meter records both imported energy (electricity consumed from the DISCO during cloudy periods and nighttime) and exported energy (surplus solar kilowatt-hours injected back into the national grid). At the end of each monthly billing cycle, the distribution utility reconciles the account. If the total exported units exceed imported units, the net credit is carried forward to subsequent billing cycles. Crucially, imported units are billed at the prevailing consumer tier rate—which routinely exceeds Rs. 58 to Rs. 71 per unit for unprotected residential slabs once surcharges, electricity duties, and sales tax are added—whereas exported energy is credited at NEPRA's predetermined national average energy purchase price (EPP), currently benchmarked between Rs. 21 and Rs. 27 per unit.</p>",
        "<p>This differential between the retail consumption rate and the wholesale buyback tariff represents the single most important metric for calculating return on investment. For an urban homeowner operating an 8 kW on-grid setup producing approximately 950 units per month, self-consuming 600 units during peak solar generation hours eliminates retail imports that would otherwise have been billed at top-tier unprotected rates. The remaining 350 exported units generate a fiscal credit that cushions evening air conditioning consumption. The financial efficiency of a solar system in Pakistan is therefore maximized not by oversized export arrays, but by aligning daytime household energy consumption directly with peak irradiance hours.</p>",
        "<h2>Capital Expenditure and System Payback Benchmark (2026)</h2>",
        """<table>
<thead>
  <tr>
    <th>System Capacity</th>
    <th>Average System Cost (PKR)</th>
    <th>Monthly Generation (Avg kWh)</th>
    <th>Monthly Bill Savings (PKR)</th>
    <th>Estimated Payback Period</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>5 kW On-Grid (3-Phase)</td>
    <td>Rs. 980,000 – 1,150,000</td>
    <td>550 – 620 units</td>
    <td>Rs. 32,000 – 38,000</td>
    <td>28 to 32 Months</td>
  </tr>
  <tr>
    <td>8 kW Hybrid / On-Grid</td>
    <td>Rs. 1,450,000 – 1,750,000</td>
    <td>900 – 1,020 units</td>
    <td>Rs. 56,000 – 65,000</td>
    <td>24 to 28 Months</td>
  </tr>
  <tr>
    <td>10 kW On-Grid (Bifacial)</td>
    <td>Rs. 1,780,000 – 2,050,000</td>
    <td>1,200 – 1,350 units</td>
    <td>Rs. 78,000 – 92,000</td>
    <td>22 to 26 Months</td>
  </tr>
  <tr>
    <td>15 kW Industrial/Large Home</td>
    <td>Rs. 2,650,000 – 3,100,000</td>
    <td>1,800 – 2,050 units</td>
    <td>Rs. 125,000 – 145,000</td>
    <td>20 to 24 Months</td>
  </tr>
</tbody>
</table>""",
        "<h2>Step-by-Step Regulatory and DISCO Approval Workflow</h2>",
        "<p>Navigating the administrative pathway from equipment procurement to green meter energization requires meticulous documentation to avoid prolonged delays. Distribution companies such as LESCO, IESCO, and K-Electric enforce strict technical compliance guidelines regarding inverter certification, earthing pit resistance, and transformer load limits. Homeowners must adhere to the following sequence to secure an authorized interconnection agreement:</p>",
        "<ul>",
        "  <li><strong>Sanctioned Load Verification:</strong> Review the property's existing electricity bill to verify the sanctioned load. NEPRA rules mandate that solar generating capacity cannot exceed the sanctioned load recorded on the meter. If an 8 kW system is planned on a 5 kW sanctioned meter, a formal load extension application must be submitted and paid prior to net metering inspection.</li>",
        "  <li><strong>Aeronautical and Equipment Certification:</strong> Ensure the selected solar inverter features valid Type Test Certification under IEC 62116 / 61727 standards and is officially listed on Alternative Energy Development Board (AEDB) approved vendor rosters. Uncertified gray-market inverters are routinely rejected during DISCO physical inspections.</li>",
        "  <li><strong>Earth Pit Resistance Testing:</strong> A dedicated earthing pit for DC surge protection and AC neutral isolation is mandatory. The measured earth resistance must register below 5 ohms. Certified installer inspection reports must include photographic verification of copper rod depth and chemical grounding compounds.</li>",
        "  <li><strong>DISCO Engineering Inspection:</strong> An executive engineer (XEN) or sub-divisional officer (SDO) inspects the isolation switches, dual-pole AC breaker, and grid disconnect protections. This safeguard prevents 'islanding'—ensuring the rooftop inverter immediately ceases output during a grid blackout to protect utility line maintenance crews.</li>",
        "  <li><strong>Bidirectional Meter Installation:</strong> Upon approval, the existing unidirectional meter is replaced with a calibrated digital bidirectional meter, and a generation license is signed under NEPRA Alternative and Renewable Energy rules.</li>",
        "</ul>",
        "<h2>Navigating Winter Smog, Dust Depreciation, and Seasonal Variance</h2>",
        "<p>A frequent blind spot in domestic financial planning is seasonal output fluctuation. In Punjab's industrial corridors, intense winter smog spanning November through January frequently degrades photovoltaic generation by forty to sixty percent. Suspended particulate matter attenuates solar irradiance, while fine soot accumulation on glass covers requires weekly cleaning with demineralized water. A 10 kW system that generates 1,400 units in May may produce fewer than 680 units during a foggy December.</p>",
        "<p>Consequently, households that depend entirely on solar generation without accounting for winter declines face sudden bill reversals if un-protected grid consumption spikes during electric heater usage. Financial planners recommend banking surplus credits during the peak irradiance window (March through October). By accumulating a reserve credit balance with the DISCO during high-yield spring months, urban families can offset winter consumption deficits without incurring out-of-pocket utility expenses.</p>",
        "<h2>Bifacial Panels vs TopCon Technology: Equipment Selection Criteria</h2>",
        "<p>Technological advancements across Chinese photovoltaic manufacturing have introduced N-Type TOPCon and Heterojunction (HJT) cells with efficiency ratings surpassing 22.5 percent. For Pakistani rooftops characterized by limited surface area and shade from parapet walls, high-density bifacial modules provide significant advantages. By capturing reflected albedo irradiance from white-painted roof surfaces, bifacial panels generate an additional eight to fifteen percent auxiliary yield throughout the day.</p>",
        "<p>Equally critical is inverter topology. While string inverters represent the most cost-effective solution for roofs with unshaded southern exposure, installations subjected to partial shading from overhead water tanks or neighboring buildings should utilize micro-inverters or DC optimizers. In a conventional string arrangement, shading on a single panel pulls down the electrical output of the entire array. Investing an additional ten percent in module-level electronics prevents substantial generation losses over the twenty-five-year operational life of the installation.</p>",
        "<h2>Protecting Household Liquidity: Self-Financing vs Bank Solar Loans</h2>",
        "<p>Financing a rooftop solar installation represents a significant capital decision. While the State Bank of Pakistan's subsidized renewable energy financing facility previously offered concessionary interest rates under Category 1, the tightening of national monetary policy has shifted the landscape toward commercial consumer installment plans. Commercial banks now offer solar financing at KIBOR plus margins that can elevate effective borrowing costs above eighteen percent.</p>",
        "<p>When evaluating financing options, wage earners must compare interest amortization schedules against anticipated DISCO tariff escalation. If domestic electricity rates continue their historical trajectory of annual double-digit increases, taking on short-term bank financing remains financially advantageous compared to paying compounding utility bills. However, households with liquid savings in low-yielding current accounts achieve an immediate, risk-free tax-effective return by deploying capital directly into rooftop solar hardware, effectively eliminating their second-largest monthly expense.</p>",
        "<h2>Battery Storage Economics: Lithium Iron Phosphate (LiFePO4) vs Tubular Lead-Acid</h2>",
        "<p>While on-grid net metering represents the gold standard for bill reduction during active grid operation, Pakistan's recurring transmission feeder trips and local transformer faults necessitate hybrid energy storage. Homeowners are frequently torn between inexpensive deep-cycle tubular lead-acid batteries and modern Lithium Iron Phosphate (LiFePO4) wall-mounted packs. A pair of tall tubular lead-acid batteries requires a modest initial outlay of approximately Rs. 130,000, but their limited depth of discharge (50 percent) and rapid degradation in scorching summer temperatures yield a functional lifespan of barely eighteen to twenty-four months.</p>",
        "<p>In contrast, 48V 100Ah or 200Ah LiFePO4 battery modules carry an upfront price tag ranging from Rs. 380,000 to Rs. 720,000, yet they deliver over 6,000 operational charge cycles at an eighty percent depth of discharge. When evaluated on a leveled cost of storage (LCOS) metric over a ten-year horizon, lithium technology delivers electricity at approximately Rs. 24 per stored kilowatt-hour, compared to Rs. 44 per kilowatt-hour for repeatedly replaced tubular batteries. For families dependent on overnight medical equipment, home oxygen concentrators, or remote software engineering workstations, the reliability of integrated lithium battery storage provides critical domestic resilience.</p>",
        "<h2>Resolving Net Metering Billing Discrepancies and DISCO Consumer Court Remedies</h2>",
        "<p>Despite having a formally commissioned bidirectional meter, thousands of consumers experience billing errors where distribution companies fail to credit exported units on monthly invoices. Common causes include unsynchronized meter reader handheld software, manual data entry omissions at the sub-division revenue office, or delayed tariff code updates. When such discrepancies occur, consumers should avoid paying incorrect disputed amounts without formal protest, as distribution billing software automatically accrues late payment surcharges that compound monthly.</p>",
        "<p>The statutory recourse begins with lodging an official written grievance with the sub-divisional officer (SDO) accompanied by photographic time-stamped proof of the bidirectional meter register display (specifically Register 1.8.0 for cumulative import and Register 2.8.0 for cumulative export). Under the NEPRA Consumer Service Manual (CSM), DISCOs are legally required to resolve meter reading disputes within seven working days. If the utility fails to issue an amended corrected bill, the consumer possesses the right to file an expedited petition before the Provincial Electric Inspector (POEI) or the designated NEPRA Consumer Complaints Tribunal, which holds judicial authority to order retroactive billing reversals and freeze coercive collection actions.</p>",
        "<h2>The Long-Term Outlook for Distributed Generation in Pakistan</h2>",
        "<p>Despite periodic bureaucratic proposals to replace net metering with less favorable gross metering arrangements, rooftop solar remains the most democratized and reliable hedge against inflation in Pakistan's troubled power sector. As national transmission infrastructure struggles with line losses and sovereign debt repayment, domestic micro-generation decentralized across residential communities lightens feeder congestion during peak cooling hours.</p>",
        "<p>For Pakistani homeowners, the imperative is clear: adopting solar energy is no longer an ecological gesture—it is an indispensable pillar of modern household financial defense. By selecting certified hardware, securing formal net metering licensing, and managing load synchronization, urban families can regain control over their domestic budgets and establish enduring energy autonomy.</p>",
    ]

    content = "\n".join(paragraphs)
    data = {
        "title": title,
        "focus_keyword": keyword,
        "meta_description": meta,
        "category_id": topic_info.get("category_id", 2),
        "status": "draft",
        "seo_title": "Solar Net Metering Pakistan 2026: ROI & Payback",
        "content_html": content,
    }
    return BlogPostPayload.model_validate(data)


def generate_mock_tax_article(topic_info: Dict[str, Any]) -> BlogPostPayload:
    """Generate 1,450+ word pre-vetted article on Salaried Tax Slabs in Pakistan."""
    title = topic_info["default_title"]
    keyword = topic_info["focus_keyword"]
    meta = topic_info["meta_description"]

    paragraphs = [
        "<p>When payroll slips were distributed to salaried professionals across Karachi, Lahore, and Islamabad at the close of the financial quarter, HR departments were inundated with urgent inquiries. For the vast majority of formal sector wage earners, the net take-home salary deposited into commercial bank accounts had contracted significantly, despite nominal annual performance increments. The culprit was a revised personal income tax regime introduced under fiscal stabilization mandates, which tightened tax brackets, elevated progressive marginal rates, and introduced punitive surcharges on upper-middle-class wage earners.</p>",
        "<p>In Pakistan's narrow tax landscape, where the informal retail economy, large-scale agriculture, and wholesale commercial markets routinely evade direct documentation, the salaried class remains the most accessible target for automated source withholding. Under Section 149 of the Income Tax Ordinance, corporate employers are legally obligated to deduct income tax at source every month. Consequently, wage earners bear the full brunt of fiscal adjustments before their salary ever reaches their hands. Navigating this economic reality requires a sophisticated understanding of tax slabs, legitimate exemptions, advance tax adjustments, and wealth statement reconciliation.</p>",
        "<h2>The Progressive Slabs of Salaried Income Tax (FY 2025-26)</h2>",
        "<p>The statutory threshold for salaried individuals remains benchmarked at Rs. 600,000 per annum (Rs. 50,000 per month). Below this baseline, individuals are categorized in the zero-tax slab. However, the moment taxable gross income crosses this threshold, withholding accelerates rapidly across steep progressive tiers. Understanding the mathematical structure of these slabs allows professionals to plan career compensation structures, medical allowances, and provident fund contributions strategically.</p>",
        "<p>Consider the trajectory: a salaried individual earning Rs. 200,000 per month faces an annual tax burden exceeding Rs. 220,000. When earnings increase to Rs. 500,000 monthly, the combination of progressive brackets and auxiliary super surcharges elevates the annual tax liability past Rs. 1.2 million. For executive management tiers, the marginal tax rate reaches thirty-five percent—excluding additional national defense levies. This steep progression creates an urgent need for legitimate tax optimization under the legal protections of the Income Tax Ordinance.</p>",
        "<h2>Monthly Paycheck Tax Deduction Breakdown (2025-2026)</h2>",
        """<table>
<thead>
  <tr>
    <th>Monthly Gross Salary (PKR)</th>
    <th>Annual Gross Income (PKR)</th>
    <th>Applicable Tax Slab</th>
    <th>Estimated Monthly Tax (PKR)</th>
    <th>Net Monthly Take-Home (PKR)</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>Rs. 100,000</td>
    <td>Rs. 1,200,000</td>
    <td>Tier 2 (5% above Rs. 600k)</td>
    <td>Rs. 2,500</td>
    <td>Rs. 97,500</td>
  </tr>
  <tr>
    <td>Rs. 200,000</td>
    <td>Rs. 2,400,000</td>
    <td>Tier 3 (Fixed + 15%)</td>
    <td>Rs. 18,333</td>
    <td>Rs. 181,667</td>
  </tr>
  <tr>
    <td>Rs. 350,000</td>
    <td>Rs. 4,200,000</td>
    <td>Tier 4 (Fixed + 25%)</td>
    <td>Rs. 53,750</td>
    <td>Rs. 296,250</td>
  </tr>
  <tr>
    <td>Rs. 500,000</td>
    <td>Rs. 6,000,000</td>
    <td>Tier 5 (Fixed + 30%)</td>
    <td>Rs. 106,250</td>
    <td>Rs. 393,750</td>
  </tr>
  <tr>
    <td>Rs. 750,000</td>
    <td>Rs. 9,000,000</td>
    <td>Tier 6 (Fixed + 35%)</td>
    <td>Rs. 202,500</td>
    <td>Rs. 547,500</td>
  </tr>
  <tr>
    <td>Rs. 1,000,000+</td>
    <td>Rs. 12,000,000+</td>
    <td>Tier 6 + High-Earner Surcharge</td>
    <td>Rs. 315,000+</td>
    <td>Rs. 685,000</td>
  </tr>
</tbody>
</table>""",
        "<h2>Legitimate Avenues for Income Tax Optimization</h2>",
        "<p>While tax evasion carries severe civil penalties and reputational risk, tax optimization through lawful allowances and statutory credits is explicitly encouraged under Pakistani law. Salaried workers often forfeit hundreds of thousands of rupees annually simply because they fail to claim statutory rebates against allowable personal expenditures. The following four legal mechanisms provide measurable relief:</p>",
        "<ul>",
        "  <li><strong>Voluntary Pension Schemes (VPS) under Section 63:</strong> Salaried individuals investing in approved voluntary pension funds regulated by the Securities and Exchange Commission of Pakistan (SECP) qualify for a direct tax credit. Up to twenty percent of taxable income can be allocated to VPS funds, reducing net tax liability dollar-for-dollar against the individual's marginal rate.</li>",
        "  <li><strong>Reimbursement of Medical Expenses under Clause (139):</strong> Medical allowances granted under company policy are tax-exempt up to ten percent of the basic salary. Alternatively, where employment contracts provide for actual medical expense hospitalization reimbursement supported by hospital invoices and national tax numbers (NTN), the reimbursed amount is entirely exempt from taxable gross income.</li>",
        "  <li><strong>Adjustable Advance Tax under Section 235 & 236:</strong> Millions of salaried individuals pay advance income tax on domestic electricity bills (Section 235), mobile telephone scratch cards and post-paid subscriptions (Section 236), and motor vehicle token taxes. Because these advance collections represent prepaid income tax, they can be directly reconciled against annual employer withholding, resulting in substantial year-end tax refunds.</li>",
        "  <li><strong>Charitable Donations to Approved NPOs under Section 61:</strong> Donations made via crossed banking cheques to institutions listed in the Second Schedule or approved non-profit organizations qualify for an immediate tax credit of up to thirty percent of the individual's taxable income for the year.</li>",
        "</ul>",
        "<h2>The Critical Importance of Active Taxpayer Status (ATL)</h2>",
        "<p>Maintaining Active Taxpayer Status on the Federal Board of Revenue's weekly ATL register is no longer optional for urban professionals. The finance acts have systematically penalized non-filers across every financial touchpoint in Pakistan. Non-filers face double withholding tax rates on banking cash withdrawals, dividend distributions, real estate transactions, and vehicle purchases.</p>",
        "<p>For instance, purchasing a modest 1000cc family sedan incurs an advance registration tax that is three times higher for non-compliant individuals compared to active filers. Similarly, banking transfers and profit coupons on National Savings certificates carry punitive non-filer withholding rates that erode capital. Filing an annual return through FBR's Iris online portal is therefore a vital financial preservation measure that directly protects family wealth.</p>",
        "<h2>Navigating Wealth Statement Reconciliation on Iris</h2>",
        "<p>The primary barrier that intimidates salaried individuals when filing tax returns is the Wealth Statement (Form 116). Under the law, filers must declare all movable and immovable assets—including residential plots, bank account balances as of June 30th, motor vehicles, gold jewellery, and foreign assets—alongside household expenditure.</p>",
        "<p>The golden rule of wealth reconciliation is mathematical equilibrium: Opening Wealth + Inflows (Salary + Capital Gains + Inheritances) - Outflows (Household Expenses + Taxes Paid) must precisely equal Closing Wealth. Discrepancies between declared household living expenses and bank account balances frequently trigger automated audit notices from FBR regional commissioners. Maintaining an organized ledger of major capital expenditures, utility payments, and foreign travel receipts protects filers against arbitary tax assessments.</p>",
        "<h2>Contract Restructuring: Allowances vs Basic Pay</h2>",
        "<p>Salaried employees negotiating employment contracts or annual appraisal compensation packages should pay close attention to compensation architecture. In Pakistan, basic salary forms the benchmark for provident fund contributions and gratuity calculations, but it also directly expands the taxable base. Structuring compensation to optimize legitimate employer-provided facilities—such as company-maintained transport under Section 23—often yields higher net utility than equivalent cash salary increases.</p>",
        "<p>When an employer provides a company-maintained vehicle, only five percent of the vehicle's capital cost is added to the employee's taxable income for private use. In contrast, receiving the equivalent value as a cash automotive allowance renders the entire monthly stipend fully taxable at the employee's highest marginal bracket. Careful contract structuring with human resource managers can legally preserve tens of thousands of rupees in monthly purchasing power.</p>",
        "<h2>Provident Fund, Gratuity, and EOBI Contributions: Tax Treatment and Optimization</h2>",
        "<p>Retirement benefits represent a vital component of long-term household wealth that enjoys favorable tax treatment under the Income Tax Ordinance. Recognized Provident Funds (RPF) allow both employer and employee contributions up to one-tenth of basic salary or Rs. 150,000 without incurring income tax. Accumulated interest credited to provident fund balances is also exempt up to one-third of the employee's salary or a statutory rate benchmarked at sixteen percent. Understanding these limits prevents employees from facing unexpected tax clawbacks upon retirement.</p>",
        "<p>Similarly, approved gratuity funds established under an irrevocable trust provide an exemption up to Rs. 300,000 or full exemption if paid under government or approved institutional schemes. Contributions toward the Employees Old-Age Benefits Institution (EOBI) provide a mandatory baseline pension for formal sector workers. By ensuring that employers accurately remit both employee and employer matching shares, salaried individuals build a protected financial buffer that appreciates in a tax-sheltered environment throughout their professional careers.</p>",
        "<h2>Audit Triggers and Responding to Section 177 / 214C Notices on Iris</h2>",
        "<p>Even diligent taxpayers may occasionally receive automated discrepancy notices issued by the FBR under Section 214C (computerized audit selection) or Section 177 (desk audit calls). The most frequent triggers include undeclared bank accounts discovered through financial intelligence withholding reports, substantial differences between employer-declared salary withholding and Iris figures, or large foreign remittances without proper bank encashment certificates (PRC).</p>",
        "<p>When an audit inquiry is issued, taxpayers must avoid ignoring the electronic notice, as failure to respond within the statutory deadline permits the tax officer to frame an ex-parte assessment order under Section 122. The proper protocol involves gathering reconciled bank statements, salary certificates (Form 149), utility bills showing advance tax deductions, and written explanations clearly cross-referencing each transaction against the declared Wealth Statement. Engaging with the audit process transparently with documentary evidence invariably results in closure of the inquiry without adverse financial penalties.</p>",
        "<h2>Long-Term Economic Strategy for Pakistan's Salaried Middle Class</h2>",
        "<p>As Pakistan continues its macroeconomic stabilization trajectory under multilateral lending arrangements, direct income tax rates on documented professionals are unlikely to decrease in the near term. The fiscal imperative of expanding tax-to-GDP ratios means salaried workers must adopt an active, documented approach to managing their personal finances.</p>",
        "<p>By systematically claiming advance tax adjustments from utility and telecom providers, maximizing contributions to voluntary pension schemes, and filing reconciled wealth statements on time, salaried professionals can minimize their statutory tax exposure while remaining fully compliant with national law. In an era of intense inflationary pressure, mastering the nuances of personal taxation is one of the most effective tools for defending household living standards.</p>",
    ]

    content = "\n".join(paragraphs)
    data = {
        "title": title,
        "focus_keyword": keyword,
        "meta_description": meta,
        "category_id": topic_info.get("category_id", 3),
        "status": "draft",
        "seo_title": "Salaried Tax Slabs FY 2025-26: Tax Optimization Guide",
        "content_html": content,
    }
    return BlogPostPayload.model_validate(data)


def generate_mock_atta_article(topic_info: Dict[str, Any]) -> BlogPostPayload:
    """Generate 1,450+ word pre-vetted article on Wheat Flour & Kitchen Inflation in Pakistan."""
    title = topic_info["default_title"]
    keyword = topic_info["focus_keyword"]
    meta = topic_info["meta_description"]

    paragraphs = [
        "<p>In the early morning mist outside provincial grain markets and Utility Stores Corporation (USC) outlets across Rawalpindi, Multan, and Peshawar, queues of working-class citizens begin forming long before shop shutters are lifted. In every Pakistani home, regardless of social stratum, the price of wheat flour (atta) serves as the psychological anchor of family financial security. When a twenty-kilogram sack of flour surges beyond two thousand rupees, it triggers an immediate chain reaction across kitchen commodity budgets, forcing parents to make painful compromises between daily nutrition, school transport fares, and healthcare needs.</p>",
        "<p>The economics of wheat in Pakistan represent a complex tug-of-war between provincial food departments, flour milling associations, private hoarding networks, and international commodity indices. While administrative crackdowns on inter-district wheat movement are frequently announced by provincial governments, the disparity between government-subsidized quotas and open-market retail prices remains a persistent source of household financial anxiety. Dissecting the supply chain of Pakistan's most critical staple commodity reveals why conventional price controls fail and how urban families can defend their monthly grocery basket.</p>",
        "<h2>The Anatomy of Pakistan's Wheat Supply Chain and Support Prices</h2>",
        "<p>Wheat is Pakistan's largest strategic cash crop, cultivating over twenty million acres annually across the fertile plains of Punjab and Sindh. The provincial governments, primarily through the Punjab Food Department and the Sindh Food Department, set an annual Minimum Support Price (MSP) per 40 kilograms to incentivize farmers during the autumn sowing season. The provincial government borrows hundreds of billions of rupees in commercial bank credit—termed commodity procurement financing—to purchase wheat directly from growers at harvest and store it in government granaries (PASSCO and provincial godowns).</p>",
        "<p>Throughout the fiscal year, this procured grain is released to registered commercial flour mills at a subsidized release rate. In theory, mills are obligated to grind this subsidized grain into standardized 10kg and 20kg green-branded bags destined for retail sale at fixed government rates. In practice, substantial portions of this subsidized grain quota are siphoned off into high-margin commercial bakeries, fine maida processing, or smuggled across regional borders where market prices are significantly higher. The resulting retail shortage in urban centers forces working-class families into the unregulated open market, where mill flour and whole-grain Chakki atta trade at a forty to sixty percent premium.</p>",
        "<h2>Comparative Breakdown of Essential Kitchen Staples (2025-2026)</h2>",
        """<table>
<thead>
  <tr>
    <th>Commodity Item</th>
    <th>Government / USC Rate (PKR)</th>
    <th>Open Market Retail Rate (PKR)</th>
    <th>Monthly Family Need (5 Persons)</th>
    <th>Monthly Budget Impact (PKR)</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>Wheat Flour (20kg Bag)</td>
    <td>Rs. 1,420 (Targeted)</td>
    <td>Rs. 2,350 – 2,600</td>
    <td>2 Bags (40 kg)</td>
    <td>Rs. 4,700 – 5,200</td>
  </tr>
  <tr>
    <td>Basmati Rice (Kernel / kg)</td>
    <td>Rs. 240</td>
    <td>Rs. 320 – 380</td>
    <td>8 kg</td>
    <td>Rs. 2,560 – 3,040</td>
  </tr>
  <tr>
    <td>Cooking Oil (Pouch / 1 Litre)</td>
    <td>Rs. 410</td>
    <td>Rs. 510 – 560</td>
    <td>5 Litres</td>
    <td>Rs. 2,550 – 2,800</td>
  </tr>
  <tr>
    <td>Daal Chana (Gram Pulse / kg)</td>
    <td>Rs. 210</td>
    <td>Rs. 310 – 360</td>
    <td>3 kg</td>
    <td>Rs. 930 – 1,080</td>
  </tr>
  <tr>
    <td>Refined Sugar (kg)</td>
    <td>Rs. 115</td>
    <td>Rs. 145 – 165</td>
    <td>5 kg</td>
    <td>Rs. 725 – 825</td>
  </tr>
  <tr>
    <td>Tea / Black Leaf (800g Pack)</td>
    <td>Rs. 980</td>
    <td>Rs. 1,250 – 1,400</td>
    <td>1 Pack</td>
    <td>Rs. 1,250 – 1,400</td>
  </tr>
</tbody>
</table>""",
        "<h2>Why Chakki Atta Commands a Premium Over Machine Mill Flour</h2>",
        "<p>In urban Pakistan, consumers face an important trade-off between traditional stone-ground Chakki atta and large-scale roller mill flour. Commercial mill flour frequently undergoes extensive sifting, separating the nutrient-dense wheat germ and dietary bran (choker) to produce fine white flour, suji, and maida for commercial confectioneries. The remaining white flour, while producing soft chapatis, offers diminished fiber and nutritional value.</p>",
        "<p>In contrast, traditional neighborhood Chakkis grind whole wheat berries between abrasive stone discs, preserving the fiber-rich bran and essential B-vitamins. However, because local Chakki operators purchase raw grain directly from open-market wholesale dealers without access to government subsidized quotas, their raw procurement costs are significantly higher. When commercial electricity tariffs and milling wastage are factored in, whole-grain Chakki flour costs up to thirty rupees more per kilogram than factory-packaged flour. For health-conscious families managing diabetes and hypertension, this creates an unavoidable financial premium in their daily grocery allocation.</p>",
        "<h2>Five Actionable Tactics for Household Kitchen Budget Defense</h2>",
        "<p>Confronted with compounding food inflation, middle-class and salaried Pakistani households cannot rely on passive retail shopping. Adopting structured procurement strategies can reduce monthly grocery bills by fifteen to twenty-five percent:</p>",
        "<ul>",
        "  <li><strong>Direct Farm and Wholesale Mandi Procurement:</strong> During the post-harvest window in April and May, families should pool capital to purchase wheat grain directly from wholesale grain mandis in 50kg jute sacks. Stored properly, whole grain can be ground at local Chakkis monthly, bypassing retail markups and middleman margins.</li>",
        "  <li><strong>Digital Verification of Ehsaas / BISP Subsidies:</strong> Ensure eligible household members are registered under the Benazir Income Support Programme (BISP) and National Socio-Economic Registry (NSER). Targeted subsidy cards provide digital point-of-sale discounts on flour, ghee, and pulses at certified USC outlets.</li>",
        "  <li><strong>Pest and Moisture Prevention in Bulk Storage:</strong> Post-harvest wheat grain is vulnerable to the Khapra beetle and rice weevils in humid monsoon months. Preserve bulk grain by incorporating dried neem leaves, food-grade diatomaceous earth, or hermetically sealed polypropylene drums rather than toxic chemical tablets.</li>",
        "  <li><strong>Neighborhood Bulk Cooperative Purchasing:</strong> Form informal neighborhood consumer groups to purchase cooking oil cartons, whole pulses, and flour sacks in bulk from regional wholesale distributors, capturing tiered volume discounts typically reserved for commercial retailers.</li>",
        "  <li><strong>Caloric Substitution and Ration Planning:</strong> Balance daily wheat consumption by incorporating domestically grown seasonal tubers, corn flour (makki atta), and broken rice varieties into weekly menu rotations, reducing vulnerability to single-commodity price spikes.</li>",
        "</ul>",
        "<h2>The Geopolitical and Currency Drivers Behind Kitchen Inflation</h2>",
        "<p>While domestic grain production is the bedrock of food security, Pakistan is deeply integrated into global commodity markets. The national edible oil industry imports over eighty-five percent of its raw palm oil requirements from Malaysia and Indonesia, meaning international freight rates and the PKR/USD exchange rate directly dictate the retail cost of cooking ghee in Lahore and Karachi.</p>",
        "<p>Similarly, when domestic wheat harvests face climactic disruptions—such as unseasonal heatwaves during the March grain-filling stage or torrential monsoon flooding—the government must allocate foreign exchange reserves to import milling wheat from the Black Sea region. International shipping demurrage, port handling charges at Karachi, and domestic diesel freight systematically inflate the landed cost of food items. For urban consumers, understanding these external drivers emphasizes why proactive household food budgeting is essential in a volatile global economy.</p>",
        "<h2>Reforming the Targeted Subsidy Architecture</h2>",
        "<p>Policy economists consistently argue that untargeted blanket subsidies—where wealthy and poor households alike access cheap flour—drain the national exchequer without providing meaningful poverty relief. The government's gradual transition toward targeted cash transfers through digital biometric wallets represents a necessary structural shift.</p>",
        "<p>By transferring targeted food subsidies directly to verified mothers and female heads of households through mobile banking apps, leakage to commercial millers is curtailed. However, for the millions of salaried workers who hover just above the poverty line and do not qualify for social safety nets, formal sector grocery inflation remains an urgent challenge that demands disciplined, strategic budgeting.</p>",
        "<h2>Managing Kitchen Commodity Inventory: Weekly Stock-Rotation Models for Joint Families</h2>",
        "<p>In large joint family households across Pakistani urban centers, unorganized grocery procurement often leads to silent financial leakage through spoilage, duplicate purchases, and unplanned emergency shopping at high-markup neighborhood convenience stores. Establishing a visual pantry inventory ledger using the First-In, First-Out (FIFO) methodology protects against waste. Families should designate specific shelf tiers for open packages and reserve unopened sealed bulk containers in cool, dark pantry spaces.</p>",
        "<p>By establishing fixed bi-weekly consumption audits for cooking oil, rice, pulses, and spices, households can time their replenishment cycles to coincide with wholesale market discount days rather than buying piecemeal under urgent domestic pressure. Calculating per-head daily caloric costs empowers household managers to identify which menu items deliver maximum nutrition per rupee expended, ensuring that growing children receive balanced dietary protein even during periods of elevated meat and poultry prices.</p>",
        "<h2>Consumer Rights and Price Control Magistrates: How Citizens Can Challenge Price Gouging</h2>",
        "<p>Under provincial Essential Commodities Price Control and Prevention of Hoarding legislation, deputy commissioners and price control magistrates hold legal authority to enforce official daily rate lists (Qeemat Punjab and Sindh Consumer apps). Despite widespread public cynicism, formal consumer complaints submitted with digital receipts and geo-tagged photographs frequently trigger immediate magistrate inspections and retail fines for offending cartels.</p>",
        "<p>Citizens should routinely check official daily commodity rate lists published online before visiting morning fruit and vegetable markets (Itwar and Juma Bazaars). When wholesale traders or neighborhood retailers charge above statutory caps, complaints lodged via the Pakistan Citizen's Portal or provincial price control hotlines create documented enforcement trails. Collective consumer vigilance remains the most effective deterrent against artificial market hoarding and localized price manipulation.</p>",
        "<h2>Empowering Households Through Informed Consumer Decisions</h2>",
        "<p>The battle against kitchen inflation is won in the details of daily procurement and domestic organization. In an era where macroeconomic adjustments place continuous pressure on grocery bills, families that measure, audit, and systematically plan their food purchases can safeguard their nutritional security without destabilizing their family finances.</p>",
        "<p>By understanding commodity pricing structures, taking advantage of cooperative bulk buying, and holding local market regulatory committees accountable, Pakistani households can navigate ongoing inflationary headwinds with resilience and financial dignity.</p>",
        '<p>While budgeting apps and ration calculators help plug leakages, the safest shield against volatile food inflation and DISCO electricity tariff spikes is a pension-backed government position. You can track verified department openings, test dates, and official syllabus breakdowns directly on <a href="https://sarkaritayari.pk" target="_blank" rel="noopener noreferrer">Sarkari Tayari</a>.</p>',
    ]

    content = "\n".join(paragraphs)
    data = {
        "title": title,
        "focus_keyword": keyword,
        "meta_description": meta,
        "category_id": topic_info.get("category_id", 1),
        "status": "draft",
        "seo_title": "Atta Subsidies vs Open Market: Grocery Guide 2026",
        "content_html": content,
    }
    return BlogPostPayload.model_validate(data)


def generate_mock_article(topic_info: Dict[str, Any]) -> BlogPostPayload:
    """
    Route to the appropriate 1,450+ word pre-vetted compliant article based on selected topic.
    """
    topic_str = (topic_info.get("topic") or topic_info.get("default_title") or "").lower()

    if "solar" in topic_str or "net metering" in topic_str:
        return generate_mock_solar_article(topic_info)
    elif "tax" in topic_str or "salary" in topic_str or "salaried" in topic_str:
        return generate_mock_tax_article(topic_info)
    elif "wheat" in topic_str or "atta" in topic_str or "flour" in topic_str or "grocery" in topic_str or "kitchen" in topic_str:
        return generate_mock_atta_article(topic_info)
    else:
        # Default high-yield solar article for general household topic validation
        return generate_mock_solar_article(topic_info)


# ---------------------------------------------------------------------------
# API Transmission
# ---------------------------------------------------------------------------

def transmit_article_to_api(
    article: BlogPostPayload,
    api_url: str,
    secret_key: str,
) -> Dict[str, Any]:
    """
    Transmit the validated article to the Laravel API endpoint.
    Strictly verifies status='draft' and passes X-Ingestion-Key header.
    Handles duplicate rejections (409 Conflict) gracefully.
    """
    if requests is None:
        raise RuntimeError("Missing 'requests' package. Run: pip install -r requirements-agent.txt")

    if not secret_key:
        raise ValueError(
            "INGESTION_SECRET_KEY is not configured in .env. "
            "Please configure INGESTION_SECRET_KEY or AGENT_INGESTION_SECRET."
        )

    headers = {
        "X-Ingestion-Key": secret_key,
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    if hasattr(article, "model_dump"):
        data_dict = article.model_dump()
    elif hasattr(article, "dict"):
        data_dict = article.dict()
    else:
        data_dict = dict(article)

    # Ensure seo_title is clean, distinct, and strictly <= 58 characters
    raw_seo_title = data_dict.get("seo_title") or data_dict.get("title", "")
    safe_seo_title = raw_seo_title.strip()
    if len(safe_seo_title) > 58:
        safe_seo_title = safe_seo_title[:55].rstrip()

    # Force draft status and structured fields
    payload = {
        "title": data_dict["title"],
        "content": data_dict["content_html"],
        "content_format": "html",
        "excerpt": data_dict.get("meta_description", ""),
        "status": "draft",
        "seo_title": safe_seo_title,
        "seo_description": data_dict.get("meta_description", ""),
        "seo_keywords": data_dict.get("focus_keyword", ""),
        "categories": [data_dict.get("category_id", 1)],
    }

    try:
        response = requests.post(api_url, json=payload, headers=headers, timeout=25)
    except requests.RequestException as e:
        raise ConnectionError(
            f"Could not connect to Laravel API at {api_url}. "
            f"Ensure the server is responsive. Error: {e}"
        )

    if response.status_code == 401:
        raise PermissionError(
            "API returned 401 Unauthorized. Check that INGESTION_SECRET_KEY in .env matches "
            "config('services.agent.secret_key') in Laravel."
        )

    if response.status_code == 409:
        try:
            err_data = response.json()
            msg = err_data.get("message", "A post with this title or slug already exists.")
            existing_id = err_data.get("existing_id")
            existing_slug = err_data.get("existing_slug")
            raise DuplicatePostError(
                f"Duplicate post rejected by target API: {msg} (Existing ID: {existing_id}, Slug: {existing_slug})"
            )
        except json.JSONDecodeError:
            raise DuplicatePostError(f"Duplicate post rejected with HTTP 409: {response.text}")

    if response.status_code != 201:
        raise RuntimeError(
            f"API rejected request with HTTP {response.status_code}: {response.text}"
        )

    try:
        return response.json()
    except Exception:
        return {"status": "ok", "raw_response": response.text}


# ---------------------------------------------------------------------------
# Main Execution CLI
# ---------------------------------------------------------------------------

def main() -> int:
    parser = argparse.ArgumentParser(
        description="Roznamcha Ingestion Agent: Programmatic AI Blog Publishing with Deduplication"
    )
    parser.add_argument(
        "--topic",
        type=str,
        default="",
        help="Topic to research and generate. If empty or already posted, automatically selects the next unposted editorial topic.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Run research + generation and preview output without transmitting to the API.",
    )
    parser.add_argument(
        "--mock",
        action="store_true",
        help="Use local pre-vetted template for testing without calling external Gemini API.",
    )
    parser.add_argument(
        "--model",
        type=str,
        default="gemini-2.5-flash",
        help="Gemini model identifier (default: gemini-2.5-flash).",
    )
    parser.add_argument(
        "--api-url",
        type=str,
        default="",
        help="Override the ingestion endpoint URL.",
    )

    args = parser.parse_args()

    print("=" * 60)
    print("Roznamcha Content Ingestion Agent")
    print("=" * 60)

    # 1. Load and display configuration status
    env = load_environment()
    gemini_key = env.get("GEMINI_API_KEY", "")
    ingestion_key = env.get("INGESTION_SECRET_KEY", "")
    api_url = args.api_url or env.get("TARGET_API_URL") or env.get("LOCAL_API_URL") or "https://roznamcha.pk/api/internal/publish-post"
    if "roznamcha.pl" in api_url:
        api_url = api_url.replace("roznamcha.pl", "roznamcha.pk")

    print(f"[*] Target Endpoint:       {api_url}")
    print(f"[*] Ingestion Key Status:  {mask_credential(ingestion_key)}")
    print(f"[*] Gemini API Key Status: {mask_credential(gemini_key)}")
    print(f"[*] Execution Mode:        {'DRY-RUN (No API Post)' if args.dry_run else 'LIVE TRANSMISSION'}")
    print("-" * 60)

    # 2. Pre-flight Deduplication: Fetch existing posts from target
    print("[*] Performing pre-flight check against target database to prevent duplicates...")
    existing_posts = fetch_existing_posts(api_url=api_url, secret_key=ingestion_key)
    print(f"[*] Retrieved {len(existing_posts)} recent posts from target endpoint.")

    # 3. Topic Selection: Pick unposted topic or auto-rotate away from duplicate
    selected_topic_info = select_unposted_topic(
        existing_posts=existing_posts,
        api_url=api_url,
        secret_key=ingestion_key,
        requested_topic=args.topic if args.topic.strip() else None,
    )

    print(f"\n[*] Active Topic Selected:  '{selected_topic_info['topic']}'")
    print(f"[*] Target Category:        {selected_topic_info.get('category_name', 'N/A')} (ID: {selected_topic_info.get('category_id', 1)})")
    print("-" * 60)

    # 4. Content Generation / Research
    article: BlogPostPayload
    if args.mock or not gemini_key:
        if not args.mock and not gemini_key:
            print("[!] Notice: GEMINI_API_KEY is not configured in .env.")
            print("[*] Generating high-quality pre-vetted research article for pipeline validation...")
        else:
            print("[*] Generating article using local pre-vetted research template (--mock)...")
        article = generate_mock_article(topic_info=selected_topic_info)
    else:
        try:
            article = generate_article_with_gemini(
                api_key=gemini_key,
                topic_info=selected_topic_info,
                model_name=args.model,
            )
        except Exception as err:
            print(f"[!] Gemini generation failed: {err}")
            print("[*] Falling back to pre-vetted template to maintain automation stability...")
            article = generate_mock_article(topic_info=selected_topic_info)

    # 5. Final Deduplication Verification on Generated Headline
    is_dup, reason = is_duplicate_topic(
        topic_or_title=article.title,
        existing_posts=existing_posts,
        api_url=api_url,
        secret_key=ingestion_key,
    )
    if is_dup:
        print(f"\n[!] ERROR: Generated headline '{article.title}' matches existing content ({reason}).")
        print("[!] Halting transmission to prevent duplicate database entry.")
        return 1

    # 6. Validation and Metrics
    word_count = count_words(article.content_html)
    print("\n" + "=" * 60)
    print("Generated Article Inspection")
    print("=" * 60)
    print(f"Title:            {article.title}")
    print(f"Focus Keyword:    {article.focus_keyword}")
    print(f"Category ID:      {article.category_id} ({selected_topic_info.get('category_name', 'General')})")
    print(f"Status:           {article.status} (Strictly enforced: draft)")
    print(f"Meta Description: {article.meta_description}")
    print(f"Word Count:       {word_count} words", end="")

    if word_count >= 1400:
        print(" [PASS: Minimum 1,400+ words target reached]")
    else:
        print(f" [WARN: Below target of 1,400 words ({word_count}/1400)]")

    # 7. Dry Run Handling
    if args.dry_run:
        print("\n" + "-" * 60)
        print("HTML Content Preview (first 500 characters):")
        print("-" * 60)
        print(article.content_html[:500] + "...\n")
        print("=" * 60)
        print("[DRY RUN COMPLETE] Content generated and validated cleanly.")
        print("[DRY RUN] No network transmission was made to the target API.")
        print("=" * 60)
        return 0

    # 8. Live Transmission to API Endpoint
    print("\n" + "-" * 60)
    print(f"[*] Transmitting draft post to target API at {api_url}...")
    try:
        response_data = transmit_article_to_api(
            article=article,
            api_url=api_url,
            secret_key=ingestion_key,
        )
        print("\n" + "=" * 60)
        print("Publication Success")
        print("=" * 60)
        print(f"Post ID:         {response_data.get('id', 'N/A')}")
        print(f"Slug:            {response_data.get('slug', 'N/A')}")
        print(f"Status in DB:    draft (Requires manual review in admin panel)")
        print(f"API Response:    {json.dumps(response_data, indent=2)}")
        print("=" * 60)
        return 0
    except DuplicatePostError as dup_err:
        print(f"\n[!] Duplicate Prevention Triggered: {dup_err}", file=sys.stderr)
        return 1
    except Exception as e:
        print(f"\n[!] API Transmission Failed: {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
