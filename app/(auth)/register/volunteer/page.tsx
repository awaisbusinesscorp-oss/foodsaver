import RegisterForm from "@/components/forms/RegisterForm";

export default function VolunteerRegisterPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
            <RegisterForm role="VOLUNTEER" roleTitle="Volunteer" />
        </div>
    );
}
