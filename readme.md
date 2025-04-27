# Disable billing cloud function for google cloud.

An updated and working version of this function.

## Steps to Disable Billing Automatically

1. **Set a Budget with Notifications**  
   Navigate to **Billing -> Budget and Alerts** and create a budget with notifications that are meant to disable billing.

2. **Connect a Budget to a Pub/Sub Topic**  
   Link the budget to a Pub/Sub topic to enable notifications.

3. **Create a Cloud Function**  
   Set up a Cloud Function that is triggered by the Pub/Sub topic.

4. **Use the Provided Code**  
   Implement the code in your Cloud Function.

5. **Test the Functionality**  
   Broadcast a Pub/Sub message with the following payload to ensure it works:

   ```json
   {
     "budgetDisplayName": "name-of-budget",
     "alertThresholdExceeded": 1.0,
     "costAmount": 100.01,
     "costIntervalStart": "2019-01-01T00:00:00Z",
     "budgetAmount": 100.0,
     "budgetAmountType": "SPECIFIED_AMOUNT",
     "currencyCode": "USD"
   }
   ```

## Additional Resources

Refer to the following sources and documentation (note that some may be outdated):
[Disable Billing with Notifications - Google Cloud](https://cloud.google.com/billing/docs/how-to/disable-billing-with-notifications#limitations)

[Google Cloud Platform - Control Your Costs - Automated Billing Disabling (with GCP console)](https://www.youtube.com/watch?v=51dwW1j7pho)

[How to Stop Runaway Bills on Google Cloud Platform](https://www.youtube.com/watch?v=KiTg8RPpGG4)
