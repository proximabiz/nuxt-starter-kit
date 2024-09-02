// import { createChargebeeCustomer, createSubscription } from '~/server/utlis/chargebee'
import { cancelSubscription } from '~/server/utlis/chargebee'

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

  // ****** Create Item/Plan in Chargebee (same our plans)
  // const newItemData = {
  //   id: ChargebeePlanEnums.ENTERPRISE_PLAN,
  //   name: 'Enterprise Plan Main',
  //   description: 'This is a enterprise subscription plan.',
  // };

  // try {
  //   const { status, statusCode, item, error } = await createChargebeeItem(newItemData);

  //   if (status === 'Error') {
  //     console.error('Error retrieving customer:', error);
  //     return {
  //       statusCode: statusCode || 500,
  //       body: { message: 'Error retrieving customer', error }
  //     };
  //   }

  //   console.log('Customer', item);
  //   return {
  //     statusCode: 200,
  //     body: item
  //   };
  // } catch (err: any) {
  //   console.error('Unexpected error:', err);
  //   return {
  //     statusCode: 500,
  //     body: { message: 'Unexpected error occurred', error: err.message }
  //   };
  // }

  //  ****** Cancel user subscription
  try {
    const { error: errorMessage } = await cancelSubscription('subs-001') // need to pass subscription id

    console.error('Error retrieving customer card details:', errorMessage)

    return {
      statusCode: 200,
      body: 'dsds',
    }
  }
  catch (err: any) {
    console.error('Unexpected error:', err)
    return {
      statusCode: 500,
      body: { message: 'Unexpected error occurred', error: err.message },
    }
  }
})
