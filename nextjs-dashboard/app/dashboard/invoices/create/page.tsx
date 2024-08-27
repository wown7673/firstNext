import Form from "@/app/ui/invoices/create-form";
import {fetchCustomers} from "@/app/lib/data";


export default async function Page(){

    const customers = await fetchCustomers();


    return (
      <div>

          안녕 create페이지야
          <Form customers={customers}/>
      </div>  
    );
}