const TitleBar = (
    { title, extra }: { title: string; extra?: React.ReactNode },
) => {
    return (
        <div className="p-2 border-b flex items-center justify-between bg-gray-50/50">
            <h3 className="text-sm font-medium text-gray-700">{title}</h3>
            {extra}
        </div>
    );
};

export default TitleBar;
