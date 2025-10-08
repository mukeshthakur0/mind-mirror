import { useEffect, useState } from "react";

export default function Dashboard() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setMessage("You are not logged in");
                return;
            }

            const res = await fetch("http://localhost:5000/protected/dashboard", {
                headers: { "Authorization": token }
            });
            const data = await res.json();
            setMessage(data.message);
        };

        fetchDashboard();
    }, []);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Dashboard</h2>
            <p>{message}</p>
        </div>
    );
}
