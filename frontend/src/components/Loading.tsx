export const Loading = () => {
    return (
        <div className="flex flex-1 items-center justify-center py-44">
            <div className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-4xl text-gray-500">
                    Почекајте...
                </p>
            </div>
        </div>
    );
};