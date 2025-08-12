import React, {useState} from "react";
import {useAuth} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";

const LoginPage: React.FC = () => {
    const {login} = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await login(email, password);
            navigate("/dashboard");
        } catch (err) {
            setError("Неверный email или пароль");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-700">
                <h1 className="text-3xl font-bold text-white text-center mb-6">
                    🔐 Вход в систему
                </h1>
                {error && (
                    <p className="text-red-500 text-center mb-4 bg-red-900 bg-opacity-20 p-2 rounded-md">
                        {error}
                    </p>
                )}
                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-gray-300 text-sm mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 text-sm mb-2">Пароль</label>
                        <input
                            type="password"
                            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full p-3 bg-indigo-600 hover:bg-indigo-700 transition rounded-lg text-white font-medium flex items-center justify-center"
                        disabled={loading}
                    >
                        {loading ? "Входим..." : "Войти"}
                    </button>
                </form>
                <p className="mt-6 text-gray-400 text-center text-sm">
                    Нет аккаунта?{" "}
                    <a
                        href="/register"
                        className="text-indigo-400 hover:underline"
                    >
                        Зарегистрироваться
                    </a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;