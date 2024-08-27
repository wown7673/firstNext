import LoginForm from "@/app/ui/login-form";
import AcmeLogo from "@/app/ui/acme-logo";

export default function LoginPage(){
    return (
        <main className="flex items-center justify-center md:h-screen">
            <div className="flex flex-col relative mx-auto w-full max-w-[400px] space-y-2.5 p-4 md:-mt-32">
                <div className="flex bg-blue-500 h-20 w-full items-center rounded-lg p-3 md:h-36">
                    <div className="w-32 text-white md:w-36">
                        <AcmeLogo />
                    </div>
                </div>
                <LoginForm />
            </div>
        </main>
    );
}