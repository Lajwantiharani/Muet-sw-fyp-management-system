const StatCard = ({ label, count, icon }) => {
    return (
        <div 
            className="flex items-center justify-between p-4 rounded-lg shadow-sm border border-primary hover:shadow-md transition-all duration-300"
            style={{ 
                backgroundImage: 'linear-gradient(to right, #6610f2, #6f42c1, #d63384)' 
            }}
        >
            <div>
                <p className="text-sm font-medium text-white truncate">{label}</p>
                <h2 className="text-2xl font-bold text-white">{count}</h2>
            </div>
            <div className="p-3 rounded-full bg-primary/10 text-white dark:bg-primary/20">
                {icon ? icon({ size: 28 }) : null}
            </div>
        </div>
    );
};

export default StatCard;
