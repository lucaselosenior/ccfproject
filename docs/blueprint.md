# **App Name**: CCF Assessment Tool

## Core Features:

- Patient Data Input: Allows input of patient data including age, HD status, hospitalization frequency, frailty, sarcopenia, and fall history via form elements like number inputs and select dropdowns.
- Clinical Evaluation Items: Provides a section for scoring clinical items (CCF clinical, IMS, VM, TSL 5x, Balance SPPB) using numeric inputs or sliders.
- Functional Evaluation Items: Provides a section for scoring functional items (CCF functional) using numeric inputs or sliders.
- CCF Score Calculation: Automatically calculates the total CCF score by summing the scores from the clinical and functional evaluation items.
- CCF Classification: Classifies the CCF score into categories (Extreme, High, Moderate, Low) based on predefined ranges and displays the classification using distinct contextual colors.  The system then uses this tool to produce the recommendation text below.
- Suggested Monitoring Plan: Displays a suggested monitoring plan based on the CCF classification, such as CCR (cuidado contínuo recomendado), CCP (cuidado contínuo provável) at different time intervals.
- Data Persistence: Allows to save and retrieve form input locally on the browser.

## Style Guidelines:

- Primary color: Soft blue (#A0C4FF) to provide a calm, professional, trustworthy interface. A modern and subtle color, as would be expected for the latest application for 2024.
- Background color: Very light blue (#F0F4FF) for a clean and unobtrusive backdrop.
- Accent color: Purple (#BFA0FF) to highlight interactive elements, buttons and key information, while maintaining a sense of modernity and calm.
- Use contextual colors: Green for 'Low', Yellow for 'Moderate', Orange for 'High', and Red for 'Extreme' classifications, making it intuitive for users to understand the results. Do not encode text into colors - use icons.
- Body and headline font: 'Inter', a sans-serif font, provides a modern, neutral look suitable for both headlines and body text. Ensure good readability across all devices.
- Use clear and intuitive icons from shadcn/ui for form elements and to represent different data types. Use icons contextually with the classification.
- Use a card-based layout with TailwindCSS for spacing and structuring the form. Ensure responsiveness across desktop and mobile devices. Provide placeholders and tooltips for each field.
- Implement subtle animations for UI transitions and feedback, using TailwindCSS for styling.