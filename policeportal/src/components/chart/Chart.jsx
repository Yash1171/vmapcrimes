import "./chart.scss"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer }
    from 'recharts';

const data = [
    {
        name: "January", Total: 45
    },
    {
        name: "February", Total: 28
    },
    {
        name: "March", Total: 34
    },
    {
        name: "April", Total: 16
    },
    {
        name: "May", Total: 29
    },
    {
        name: "June", Total: 36
    }
]

function chart({ title}) {
    return (
        <div className="chart">
            <div className="title">{title}</div>
            <ResponsiveContainer width="100%" height="90%">
                <AreaChart width={760} height={200} data={data}
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="Total" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                        </linearGradient>

                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area type="monotone" dataKey="Total" stroke="#8884d8" fillOpacity={1} fill="url(#Total)" />
                    
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

export default chart
