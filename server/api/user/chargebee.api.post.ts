// import { createChargebeeItemAndPrice } from '~/server/utlis/chargebee';

export default defineEventHandler(async () => {
  // delete customer card
  // const customer = await deleteCustomerCardDetails('AzqaEgUL3pdAYG9p')

  // *********** customer creation
  // try {
  //   const { status, statusCode, customer, error } = await createChargebeeCustomer({firstName:''});
  //   if (status === 'Error') {
  //     console.error('Error creating customer:', error);
  //     return {
  //       statusCode: statusCode || 500,
  //       body: { message: 'Error creating customer', error }
  //     };
  //   }
  //   console.log('Customer', customer);
  //   return {
  //     statusCode: 200,
  //     body: customer
  //   };
  // } catch (err: any) {
  //   console.error('Unexpected error:', err);
  //   return {
  //     statusCode: 500,
  //     body: { message: 'Unexpected error occurred', error: err.message }
  //   };
  // }

  //* ******** */ customer list
  // try {
  //     const { status, statusCode, customers, error } = await listChargebeeCustomers(10);

  //     if (status === 'Error') {
  //       console.error('Error listing customers:', error);
  //       return {
  //         statusCode: statusCode || 500,
  //         body: { message: 'Error listing customers', error }
  //       };
  //     }

  //     console.log('Customers', customers);
  //     return {
  //       statusCode: 200,
  //       body: { customers }
  //     };
  //   } catch (err: any) {
  //     console.error('Unexpected error:', err);
  //     return {
  //       statusCode: 500,
  //       body: { message: 'Unexpected error occurred', error: err.message }
  //     };
  //   }

  //* *****specific customer
  // const customerId  = 'AzqaRDUIrzqAwfHr'; // Assuming you pass customerId as a query parameter
  // if (!customerId) {
  //     return {
  //     statusCode: 400,
  //     body: { message: 'Customer ID is required' }
  //     };
  // }

  // try {
  //     const { status, statusCode, customer, error } = await getChargebeeCustomer(customerId);

  //     if (status === 'Error') {
  //     console.error('Error retrieving customer:', error);
  //     return {
  //         statusCode: statusCode || 500,
  //         body: { message: 'Error retrieving customer', error }
  //     };
  //     }

  //     console.log('Customer', customer);
  //     return {
  //     statusCode: 200,
  //     body: customer
  //     };
  // } catch (err: any) {
  //     console.error('Unexpected error:', err);
  //     return {
  //     statusCode: 500,
  //     body: { message: 'Unexpected error occurred', error: err.message }
  //     };
  // }

  // *********** deleting customer
  // try {
  //         const { status, statusCode, customer, error } = await deleteChargebeeCustomer('AzqaRDUIrzqAwfHr');

  //         if (status === 'Error') {
  //         console.error('Error retrieving customer:', error);
  //         return {
  //             statusCode: statusCode || 500,
  //             body: { message: 'Error retrieving customer', error }
  //         };
  //         }

  //         console.log('Customer', customer);
  //         return {
  //         statusCode: 200,
  //         body: customer
  //         };
  // } catch (err: any) {
  //     console.error('Unexpected error:', err);
  //     return {
  //     statusCode: 500,
  //     body: { message: 'Unexpected error occurred', error: err.message }
  //     };
  // }

  // *********** Update customer card details
  // try {
  //         const { status, statusCode, customerCard, error } = await updateCustomerCardDetails('AzqaRDUIryxGye76');

  //         if (status === 'Error') {
  //         console.error('Error retrieving customer card details:', error);
  //         return {
  //             statusCode: statusCode || 500,
  //             body: { message: 'Error retrieving customer card details', error }
  //         };
  //         }

  //         console.log('Customer card: ', customerCard);
  //         return {
  //         statusCode: 200,
  //         body: customerCard
  //         };
  // } catch (err: any) {
  //     console.error('Unexpected error:', err);
  //     return {
  //     statusCode: 500,
  //     body: { message: 'Unexpected error occurred', error: err.message }
  //     };
  // }

  // *********** Plan/ Item details
  // try {
  //     const { status, statusCode, plans, error } = await getPlanDetails();

  //     if (status === 'Error') {
  //         console.error('Error retrieving customer card details:', error);
  //         return {
  //             statusCode: statusCode || 500,
  //             body: { message: 'Error retrieving customer card details', error }
  //         };
  //     }

  //     // console.log('Customer card: ', plans);
  //     return {
  //         statusCode: 200,
  //         body: plans
  //     };
  // } catch (err: any) {
  //     console.error('Unexpected error:', err);
  //     return {
  //         statusCode: 500,
  //         body: { message: 'Unexpected error occurred', error: err.message }
  //     };
  // }

  // ****** Create Subcription for customer
  // const newItemData = {
  //     id: 'basic_plan',
  //     name: 'Basic Plan',
  //     description: 'This is a basic subscription plan.',
  //   };

  //   const newItemPriceData = {
  //     id: 'basic_plan_monthly',
  //     item_id: 'basic_plan',
  //     name: 'Basic Plan Monthly',
  //     price: 2999, // In cents
  //     currency_code: 'USD',
  //     period: 1,
  //     period_unit: 'month',
  //     trial_period: 30,
  //     trial_period_unit: 'day',
  //   };
  // try {
  //         const { status, statusCode, item, error } = await createChargebeeItemAndPrice(newItemData,newItemPriceData );

  //         if (status === 'Error') {
  //         console.error('Error retrieving customer:', error);
  //         return {
  //             statusCode: statusCode || 500,
  //             body: { message: 'Error retrieving customer', error }
  //         };
  //         }

  //         console.log('Customer', item);
  //         return {
  //         statusCode: 200,
  //         body: item
  //         };
  // } catch (err: any) {
  //     console.error('Unexpected error:', err);
  //     return {
  //     statusCode: 500,
  //     body: { message: 'Unexpected error occurred', error: err.message }
  //     };
  // }

  // try {
  //     const { status, statusCode, item, error } = await createSubscription();

  //     if (status === 'Error') {
  //     console.error('Error retrieving customer card details:', error);
  //     return {
  //         statusCode: statusCode || 500,
  //         body: { message: 'Error retrieving customer card details', error }
  //     };
  //     }

  //     console.log('Customer card: ', item);
  //     return {
  //     statusCode: 200,
  //     body: item
  //     };
  // } catch (err: any) {
  //     console.error('Unexpected error:', err);
  //     return {
  //     statusCode: 500,
  //     body: { message: 'Unexpected error occurred', error: err.message }
  //     };
  // }
})
