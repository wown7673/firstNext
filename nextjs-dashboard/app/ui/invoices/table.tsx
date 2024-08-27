import Image from 'next/image';
import { UpdateInvoice, DeleteInvoice } from '@/app/ui/invoices/buttons';
import InvoiceStatus from '@/app/ui/invoices/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredInvoices } from '@/app/lib/data';
import {InvoicesTable} from "@/app/lib/definitions";


export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {


  const invoices = await fetchFilteredInvoices(query, currentPage);
  return (

    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {invoices?.map((invoice:InvoicesTable)=>{
              return (
                  <div key={invoice.id} className="border border-blue-800 mb-2 rounded bg-white p-4">
                      <div className="flex items-center justify-between border-b pb-4">
                        <div>
                          <div className="flex items-center mb-2">
                            <Image src={invoice.image_url} width={28} height={28} className="rounded-full mr-2"/>
                            <p>{invoice.name}</p>
                          </div>
                          <p className="text-sm text-gray-500 ">{invoice.email}</p>
                        </div>
                        <InvoiceStatus status={invoice.status}/>
                      </div>
                      <div className="flex w-full justify-between items-center pt-4">
                        <div>
                          <div className="text-xl font-medium">{formatCurrency(invoice.amount)}</div>
                          <div>{formatDateToLocal(invoice.date)}</div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <UpdateInvoice id={invoice.id}/>
                          <DeleteInvoice id={invoice.id}/>
                        </div>
                      </div>
                  </div>


              )
            })}
            {invoices?.map((invoice) => (
              <div
                key={invoice.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={invoice.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${invoice.name}'s profile picture`}
                      />
                      <p>{invoice.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{invoice.email}</p>
                  </div>
                  <InvoiceStatus status={invoice.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {formatCurrency(invoice.amount)}
                    </p>
                    <p>{formatDateToLocal(invoice.date)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateInvoice id={invoice.id} />
                    <DeleteInvoice id={invoice.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

  );
}
