export interface userPlan{
   plan_name: string 
   amount:number
   renew_date:string
   
  }

  export interface State {
    planDetails: userPlan[]
  }