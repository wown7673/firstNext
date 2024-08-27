import EditInvoiceForm from "@/app/ui/invoices/edit-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import Form from "@/app/ui/invoices/create-form";
import {fetchCustomers, fetchInvoiceById} from "@/app/lib/data";
import {log} from "next/dist/server/typescript/utils";
import {notFound} from "next/navigation";

export default async function Page({params}:{params :{id:string}}){

   const [invoice, customers] = await Promise.all([
       fetchInvoiceById(params.id),
       fetchCustomers()
   ]);

/*
   if(!invoice){
       notFound();
   }
*/

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Invoices', href: '/dashboard/invoices' },
                    {
                        label: 'Edit Invoice',
                        href: `/dashboard/invoices/${params.id}/edit`,
                        active: true,
                    },
                ]}
            />
            <EditInvoiceForm invoice={invoice} customers={customers}/>
        </main>

    );
}