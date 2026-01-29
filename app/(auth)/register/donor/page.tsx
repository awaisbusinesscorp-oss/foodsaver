import RegisterForm from "@/components/forms/RegisterForm";

export default function DonorRegisterPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
            <RegisterForm role="DONOR" roleTitle="Food Donor" />
        </div>
    );
}
