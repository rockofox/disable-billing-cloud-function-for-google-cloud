const functions = require('@google-cloud/functions-framework');
const {CloudBillingClient} = require('@google-cloud/billing');

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT;
const PROJECT_NAME = `projects/${PROJECT_ID}`;
const billing = new CloudBillingClient();

// Register a CloudEvent callback with the Functions Framework that will
// be executed when the Pub/Sub trigger topic receives a message.
functions.cloudEvent('stopBilling', async cloudEvent => {
    
    const pubsubData = JSON.parse(
        Buffer.from(cloudEvent.data.message.data, 'base64').toString()
    );

    console.log(
        "Budget display name : ", pubsubData.budgetDisplayName, 
        "\tCost amount : ", pubsubData.costAmount, 
        "\tBudget amount : ", pubsubData.budgetAmount
    );

    if (pubsubData.costAmount <= pubsubData.budgetAmount) {
        console.log("No action necessary.");
        return `No action necessary. (Current cost: ${pubsubData.costAmount}, Budget amount : ${pubsubData.budgetAmount})`;
    }

    if (!PROJECT_ID) {
        console.log("no project specified");
        return 'No project specified';
    }

    const billingEnabled = await _isBillingEnabled(PROJECT_NAME);
    if (billingEnabled) {
        console.log(`Costs are over budget and billing is still enabled. Disabling billing...`)
        return _disableBillingForProject(PROJECT_NAME);
    } else {
        return 'Billing already disabled';
    }

});

/**
 * Determine whether billing is enabled for a project
 * @param {string} projectName Name of project to check if billing is enabled
 * @return {bool} Whether project has billing enabled or not
 */
const _isBillingEnabled = async projectName => {
  try {
    const [res] = await billing.getProjectBillingInfo({name: projectName});
    return res.billingEnabled;
  } catch (e) {
    console.log(
      'Unable to determine if billing is enabled on specified project, assuming billing is enabled'
    );
    return true;
  }
};

/**
 * Disable billing for a project by removing its billing account
 * @param {string} projectName Name of project disable billing on
 * @return {string} Text containing response from disabling billing
 */
const _disableBillingForProject = async projectName => {
  const [res] = await billing.updateProjectBillingInfo({
    name: projectName,
    resource: {billingAccountName: ''}, // Disable billing
  });
  console.log("Billing disabled.");
  return `Billing disabled: ${JSON.stringify(res)}`;
};