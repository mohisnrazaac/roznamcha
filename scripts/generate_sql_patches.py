import json
import os

sources_config = {
    'salaried-tax-slabs-fy-2025-26-and-income-tax-optimization-strategies-for-pakistani-professionals': [
        ('Federal Board of Revenue (FBR) - Income Tax Ordinance, 2001', 'https://www.fbr.gov.pk', 'First Schedule Part I Division I statutory rates and progressive slabs for salaried individuals', 'November 2026'),
        ('FBR Iris E-Filing & Active Taxpayer Portal', 'https://iris.fbr.gov.pk', 'Active Taxpayer List (ATL) verification and statutory withholding adjustments under Sections 149, 235, and 236', 'November 2026'),
        ('Ministry of Finance, Government of Pakistan', 'https://finance.gov.pk', 'Federal budget documentation and Finance Act personal income taxation measures', 'November 2026')
    ],
    'pakistani-freelancer-tax-slabs-pseb-registration-and-foreign-remittance-withholding-guide-2026': [
        ('Federal Board of Revenue (FBR) - Section 154A', 'https://www.fbr.gov.pk', 'Statutory withholding tax on export of computer software and IT-enabled services (0.25% concessionary vs 1% standard rate)', 'November 2026'),
        ('Pakistan Software Export Board (PSEB)', 'https://pseb.org.pk', 'Official freelancer registration, IT exporter verification, and inward remittance documentation protocols', 'November 2026'),
        ('State Bank of Pakistan (SBP) Foreign Exchange Manual', 'https://www.sbp.org.pk', 'Chapter 12 guidelines on home remittances and Proceeds Realisation Certificates (PRC)', 'November 2026')
    ],
    'pakistan-inflation-9-2-percent-july-2026-household-budget': [
        ('Pakistan Bureau of Statistics (PBS) - Monthly CPI Bulletin', 'https://www.pbs.gov.pk', 'Official Consumer Price Index (CPI) bulletin for July 2026 (Base Year 2015-16)', 'November 2026'),
        ('State Bank of Pakistan (SBP) - Inflation and Monetary Policy Monitor', 'https://www.sbp.org.pk', 'Monetary Policy Committee assessments and headline inflation trends', 'November 2026')
    ],
    'gold-investment-vs-national-savings-certificates-protecting-wealth-against-pkr-devaluation-2026': [
        ('Central Directorate of National Savings (CDNS)', 'https://savings.gov.pk', 'Statutory profit rates on Behbood Savings Certificates, Regular Income Certificates, and Special Savings Certificates', 'November 2026'),
        ('State Bank of Pakistan (SBP) - Financial Market Data', 'https://www.sbp.org.pk', 'Domestic money market benchmarks, treasury rates, and foreign exchange reserves data', 'November 2026'),
        ('Federal Board of Revenue (FBR)', 'https://www.fbr.gov.pk', 'Withholding tax rates on profit on debt under Section 7B of the Income Tax Ordinance', 'November 2026')
    ],
    'solar-net-metering-regulations-in-pakistan-2026-payback-period-and-roi-breakdown': [
        ('National Electric Power Regulatory Authority (NEPRA)', 'https://nepra.org.pk', 'NEPRA (Alternative & Renewable Energy) Distributed Generation and Net Metering Regulations', 'November 2026'),
        ('Private Power and Infrastructure Board (PPIB)', 'https://www.ppib.gov.pk', 'National solarization standards, certified inverter specifications, and grid-connection framework', 'November 2026'),
        ('Ministry of Energy (Power Division)', 'https://www.mowp.gov.pk', 'National energy policy directives and off-peak / peak residential electricity tariff structures', 'November 2026')
    ],
    'pakistan-electricity-tariff-increases-and-household-budgeting-defense-2026': [
        ('National Electric Power Regulatory Authority (NEPRA)', 'https://nepra.org.pk', 'Consumer-End Domestic Tariff Determinations and Schedule (Protected vs Non-Protected domestic slabs)', 'November 2026'),
        ('Ministry of Energy (Power Division)', 'https://www.mowp.gov.pk', 'Uniform Domestic Electricity Tariff Guidelines, FPA mechanisms, and Financing Cost Surcharges', 'November 2026')
    ],
    'fuel-price-deregulation-in-pakistan-transport-inflation-and-commuter-survival-guide': [
        ('Oil & Gas Regulatory Authority (OGRA)', 'https://www.ogra.org.pk', 'Fortnightly petroleum product pricing calculation summaries and dealer margins', 'November 2026'),
        ('Ministry of Energy (Petroleum Division)', 'https://petroleum.gov.pk', 'Petroleum Development Levy (PDL) notifications and downstream petroleum deregulation policies', 'November 2026'),
        ('Pakistan Bureau of Statistics (PBS)', 'https://www.pbs.gov.pk', 'CPI transport group sub-index and weekly fuel price tracking in Sensitive Price Indicator', 'November 2026')
    ],
    'wheat-flour-atta-subsidies-vs-open-market-rates-managing-kitchen-grocery-inflation-2026': [
        ('Privatisation Commission of Pakistan', 'https://privatisation.gov.pk', 'Federal Cabinet decisions on Public Sector Enterprises restructuring and cessation of Utility Stores Corporation retail network', 'November 2026'),
        ('Pakistan Bureau of Statistics (PBS) - Weekly SPI', 'https://www.pbs.gov.pk', 'Weekly Sensitive Price Indicator (SPI) bulletins for wheat flour, pulses, sugar, and cooking oil', 'November 2026'),
        ('Provincial Food Departments (Punjab & Sindh)', 'https://food.punjab.gov.pk', 'Official wheat procurement prices, flour mill release quotas, and notified fair-price shop benchmarks', 'November 2026')
    ],
    'electric-bikes-vs-70cc-petrol-motorcycles-in-pakistan-total-cost-of-ownership-and-payback-2026': [
        ('Engineering Development Board (EDB)', 'https://www.edb.gov.pk', 'National Electric Vehicles Policy (NEVP) standards and domestic 2-wheeler manufacturing incentives', 'November 2026'),
        ('National Electric Power Regulatory Authority (NEPRA)', 'https://nepra.org.pk', 'Domestic electricity tariff rates used for residential EV charging unit cost calculations', 'November 2026'),
        ('Oil & Gas Regulatory Authority (OGRA)', 'https://www.ogra.org.pk', 'Fortnightly motor gasoline consumer pricing used for comparative petrol commuter baseline', 'November 2026')
    ],
    'best-monthly-budget-50000-salary-pakistan-2026': [
        ('Federal Board of Revenue (FBR)', 'https://www.fbr.gov.pk', 'Statutory tax-free threshold of Rs. 600,000 per annum (Rs. 50,000/month) under First Schedule of Income Tax Ordinance', 'November 2026'),
        ('Pakistan Bureau of Statistics (PBS)', 'https://www.pbs.gov.pk', 'Household Integrated Economic Survey (HIES) consumer expenditure quintile shares', 'November 2026'),
        ('National Electric Power Regulatory Authority (NEPRA)', 'https://nepra.org.pk', 'Protected domestic electricity consumer consumption benchmark (under 200 units threshold)', 'November 2026')
    ],
    'how-to-use-digital-roznamcha-for-business-and-personal-finance-2025': [
        ('Federal Board of Revenue (FBR) - Section 174', 'https://www.fbr.gov.pk', 'Statutory obligations for maintaining books of accounts, receipts, and vouchers under Income Tax Ordinance 2001', 'November 2026'),
        ('State Bank of Pakistan (SBP) - Financial Literacy Program', 'https://www.sbp.org.pk', 'National Financial Literacy Program curriculum for MSME cash-flow management and digital ledger recordkeeping', 'November 2026'),
        ('Securities & Exchange Commission of Pakistan (SECP)', 'https://www.secp.gov.pk', 'Small business accounting guidelines and corporate documentation compliance', 'November 2026')
    ],
    'pakistani-family-monthly-expense-control': [
        ('Pakistan Bureau of Statistics (PBS)', 'https://www.pbs.gov.pk', 'Monthly Consumer Price Index and urban/rural household consumption expenditure tables', 'November 2026'),
        ('Securities & Exchange Commission of Pakistan (SECP)', 'https://www.secp.gov.pk', 'Investor education guidelines on SECP-licensed Islamic money market mutual funds for liquid emergency funds', 'November 2026'),
        ('National Electric Power Regulatory Authority (NEPRA)', 'https://nepra.org.pk', 'Domestic consumer tariff rules and energy conservation thresholds', 'November 2026')
    ],
    'ghar-ka-monthly-budget': [
        ('پاکستان بیورو آف شماریات (PBS)', 'https://www.pbs.gov.pk', 'گھریلو آمدنی و اخراجات کا شماریاتی سروے (HIES) اور ضروری اشیائے خورونوش کے قیمت انڈیکس کے سرکاری اعداد و شمار', 'نومبر 2026'),
        ('اسٹیٹ بینک آف پاکستان (SBP)', 'https://www.sbp.org.pk', 'قومی مالیاتی خواندگی پروگرام (NFLP) کے تحت گھریلو بجٹ سازی اور بچت کے رہنما اصول', 'نومبر 2026'),
        ('سیکیورٹیز اینڈ ایکسچینج کمیشن آف پاکستان (SECP)', 'https://www.secp.gov.pk', 'اسلامی میوچل فنڈز اور ہنگامی بچت کے قانونی و مالیاتی رہنما اصول', 'نومبر 2026'),
        ('نیشنل الیکٹرک پاور ریگولیٹری اتھارٹی (NEPRA)', 'https://nepra.org.pk', 'گھریلو بجلی صارفین کے محفوظ (Protected) اور غیر محفوظ (Unprotected) سلیب کے قواعد', 'نومبر 2026')
    ]
}

def sql_escape(s):
    return s.replace('\\', '\\\\').replace("'", "\\'")

slug_list = sorted(list(sources_config.keys()))

patch_sql = [
    '-- Roznamcha: 13 reviewed AdSense article sources and freshness updates',
    '-- Date: 2026-11-18',
    '-- Take a database backup first. These statements update existing content for the 13 surviving indexable posts only.',
    '',
    'SET NAMES utf8mb4;',
    '',
    '-- PRE-FLIGHT: this result must be exactly 13 before continuing.',
    'SELECT COUNT(*) AS matching_posts',
    'FROM blog_posts',
    'WHERE slug IN (\n    ' + ",\n    ".join(f"'{s}'" for s in slug_list) + '\n);',
    '',
    'START TRANSACTION;',
    ''
]

rollback_sql = [
    '-- Roznamcha: ROLLBACK for 13 reviewed AdSense article sources updates',
    '-- Date: 2026-11-18',
    '-- Restores original article contents captured prior to the 2026-11-18 patch.',
    '',
    'SET NAMES utf8mb4;',
    '',
    '-- PRE-FLIGHT: this result must be exactly 13 before continuing.',
    'SELECT COUNT(*) AS matching_posts',
    'FROM blog_posts',
    'WHERE slug IN (\n    ' + ",\n    ".join(f"'{s}'" for s in slug_list) + '\n);',
    '',
    'START TRANSACTION;',
    ''
]

for slug in slug_list:
    json_path = f'tmp/articles/{slug}.json'
    with open(json_path) as f:
        data = json.load(f)
    orig_content = data['content']
    
    escaped_orig = sql_escape(orig_content)
    rollback_sql.append(f"-- Rollback for: {slug}")
    rollback_sql.append(f"UPDATE blog_posts SET content = '{escaped_orig}' WHERE slug = '{slug}';\n")
    
    new_content = orig_content
    
    if slug == 'pakistan-inflation-9-2-percent-july-2026-household-budget':
        banner = '<div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 1rem 1.25rem; margin-bottom: 1.5rem; border-radius: 0 0.375rem 0.375rem 0;"><p style="margin: 0; font-size: 0.95rem; color: #1e293b; line-height: 1.5;"><strong>Statistical Snapshot (July 2026 Data):</strong> This analysis examines the official Consumer Price Index (CPI) bulletin released by the Pakistan Bureau of Statistics (PBS) for July 2026, recording headline year-on-year inflation at 9.2%. For subsequent monthly inflation bulletins and current CPI releases, refer directly to <a href="https://www.pbs.gov.pk" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline;">pbs.gov.pk</a>.</p></div>\n'
        new_content = banner + new_content
        
    items = sources_config[slug]
    if slug == 'ghar-ka-monthly-budget':
        sources_html = '\n<div style="margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid #e2e8f0;">\n  <h2>سرکاری ذرائع اور حوالہ جات (Sources &amp; References)</h2>\n  <p>اس تجزیے میں بیان کردہ بجٹنگ اصول، شماریاتی رجحانات اور مالیاتی ہدایات درج ذیل سرکاری و ریگولیٹری اداروں کے جاری کردہ ڈیٹا پر مبنی ہیں:</p>\n  <ul>\n'
        for title, url, desc, dt in items:
            sources_html += f'    <li><strong><a href="{url}" target="_blank" rel="noopener noreferrer">{title}</a></strong>: {desc} <em>(تاریخ تصدیق: {dt})</em></li>\n'
        sources_html += '  </ul>\n</div>\n'
        
        if '</article>' in new_content:
            new_content = new_content.replace('</article>', sources_html + '</article>')
        else:
            new_content += sources_html
    else:
        sources_html = '\n<div style="margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid #e2e8f0;">\n  <h2>Sources &amp; Regulatory References</h2>\n  <p>The figures, regulatory provisions, and economic frameworks cited in this analysis are grounded in official public records and statutory schedules:</p>\n  <ul>\n'
        for title, url, desc, dt in items:
            sources_html += f'    <li><strong><a href="{url}" target="_blank" rel="noopener noreferrer">{title}</a></strong>: {desc} <em>(Accessed: {dt})</em></li>\n'
        sources_html += '  </ul>\n</div>\n'
        new_content += sources_html

    escaped_new = sql_escape(new_content)
    patch_sql.append(f"-- Sources and freshness patch for: {slug}")
    patch_sql.append(f"UPDATE blog_posts SET content = '{escaped_new}' WHERE slug = '{slug}';\n")

patch_sql.append('COMMIT;')
rollback_sql.append('COMMIT;')

with open('database/patches/2026-11-18_article-sources.sql', 'w', encoding='utf-8') as f:
    f.write('\n'.join(patch_sql))

with open('database/patches/2026-11-18_article-sources_ROLLBACK.sql', 'w', encoding='utf-8') as f:
    f.write('\n'.join(rollback_sql))

print('Regenerated database/patches/2026-11-18_article-sources.sql')
print('Regenerated database/patches/2026-11-18_article-sources_ROLLBACK.sql')
