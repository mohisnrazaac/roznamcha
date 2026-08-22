<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BlogPost;
use App\Models\BlogCategory;
use App\Models\User;

class CustomBlogPostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = User::where('email', 'admin@roznamcha.pk')->first() ?? User::first();
        
        $category = BlogCategory::firstOrCreate(
            ['slug' => 'household-budgeting'],
            ['name' => 'Household Budgeting']
        );
        
        $slug = 'smart-household-budgeting-tips';
        
        $content = <<<MD
## 1. Track Your Income and Expenses

The foundation of any good budget is knowing exactly how much money is coming in and how much is going out. For one month, track every single expense, from your rent or mortgage to that morning cup of coffee. You can use a spreadsheet, a budgeting app, or simply a notebook. 

## 2. Implement the 50/30/20 Rule

A simple but effective framework is the 50/30/20 rule:
* **50% for Needs:** Essential living expenses like housing, groceries, utilities, and insurance.
* **30% for Wants:** Discretionary spending like dining out, entertainment, and hobbies.
* **20% for Savings and Debt Payoff:** Building an emergency fund, investing for retirement, and paying down high-interest debt.

## 3. Automate Your Savings

Don't wait until the end of the month to see what's left over for savings—pay yourself first. Set up an automatic transfer from your checking account to your savings account on the day you get paid. This ensures your savings grow consistently without you having to think about it.

## 4. Cut Unnecessary Subscriptions

We all have them: streaming services we rarely watch, gym memberships we don't use, or app subscriptions we forgot about. Review your bank statements regularly and ruthlessly cancel anything that isn't providing value. 

## 5. Plan Your Meals

Food is often one of the largest variable expenses in a household. Planning your meals for the week before you go grocery shopping can significantly reduce impulse buys and food waste. Stick strictly to your shopping list!

## 6. Build an Emergency Fund

Unexpected expenses are a part of life. Whether it's a car repair or a medical bill, having an emergency fund prevents you from going into debt when things go wrong. Aim to save at least three to six months' worth of living expenses in an easily accessible high-yield savings account.

By implementing these strategies, you'll gain better control over your finances and reduce financial stress in your household.
MD;

        $postData = [
            'title' => 'Smart Household Budgeting Tips',
            'excerpt' => 'Discover practical and actionable strategies to take control of your finances, reduce stress, and effectively manage your household budget.',
            'content' => $content,
            'content_format' => 'markdown',
            'status' => 'published',
            'published_at' => now(),
            'seo_title' => 'Smart Household Budgeting Tips | Roznamcha',
            'seo_description' => 'Discover practical strategies to take control of your finances, reduce stress, and effectively manage your household budget.',
            'seo_keywords' => 'budgeting, household, finance, savings, money management, 50/30/20 rule',
            'created_by' => $user->id,
            'updated_by' => $user->id,
        ];
        
        $post = BlogPost::updateOrCreate(['slug' => $slug], $postData);
        
        $post->categories()->sync([$category->id]);
        
        BlogPost::forgetPublicSitemapCache();
    }
}
