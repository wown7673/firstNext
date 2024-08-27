'use server';

import z from 'zod';
import {sql} from "@vercel/postgres";
import {revalidatePath, revalidateTag} from "next/cache";
import {redirect} from "next/navigation";


const FormSchma = z.object({
    id : z.string(),
    customerId : z.string({
        invalid_type_error : "타입이 잘못되었음",
    }),
    amount : z.coerce.number().gt(0, {message: "0초과금액을 입력해주세요"}),
    status : z.enum(['pending', 'paid'], {
        invalid_type_error : "선택해주세요"
    }),
    date : z.string()
});

export type State = {
    errors? : {
        customerId? : string[];
        amount? : string[];
        status?: string[];
    };
    message? :strinig | null;
};


const myFormSchma = FormSchma.omit({id:true, date:true});

export async function createInvoice( prevState:State , formData:FormData){
    const validatedFields = myFormSchma.safeParse({
        customerId : formData.get('customerId'),
        amount : formData.get('amount'),
        status : formData.get('status')
    });

    // 유효성검사가 실패시 바로 에러 반환
    if(!validatedFields.success){
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message : "누락된 항목이 있어 생성에 실패하였음"
        }
    }

    const { customerId , amount, status } = validatedFields.data;

    // 일반적으로 JS의 부동소수점 오류를 제거하고 정확성을 높이기위해 DB에 센트 단위로 저장하는것이 좋다.
    const amountInCents = amount * 100;

    // 그리고 날짜를 YYYY-MM-DD 형식으로 추가하자.
    const date = new Date().toISOString().split('T')[0];

    try{
            await sql`
            INSERT INTO invoices(customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
    }catch(e){
        return {
            message : "db error : invoice생성실패"
        }
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

const UpdateInvoice = FormSchma.omit({id:true, date:true});
export async function updateInvoice(id:string,  formData:FormData){
    const {customerId, amount, status} = UpdateInvoice.parse({
        customerId : formData.get("customerId"),
        amount : formData.get("amount"),
        status : formData.get("status")
    });


    const amountInCents = amount*100;

    await sql`
        UPDATE invoices SET 
            customer_id = ${customerId},
            amount = ${amountInCents},
            status = ${status}
        WHERE id = ${id}
    `;

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}


export async function deleteInvoice(id:string) {
    throw new Error("에러요~");

    try{
        await sql`
            DELETE
            FROM invoices
            WHERE ID = ${id}
        `;

        revalidatePath('/dashboard/invoices');
        return {msg : "삭제성공"}
    }catch (e){
        return {msg : "db삭제오류"};
    }
}

export async function authenticate(){

}