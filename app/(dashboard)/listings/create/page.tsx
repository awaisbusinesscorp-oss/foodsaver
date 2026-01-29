import CreateListingForm from "@/components/forms/CreateListingForm";

export default function CreateListingPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                    Donate Surplus Food
                </h1>
                <p className="mt-4 text-xl text-muted-foreground">
                    Your donation can provide a healthy meal for someone today.
                </p>
            </div>
            <CreateListingForm />
        </div>
    );
}
