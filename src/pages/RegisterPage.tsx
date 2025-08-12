import React, {useState} from 'react';
import {useAuth} from '../context/AuthContext';

interface RegisterForm {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    twoFactorEnabled: boolean;
}

const RegisterPage: React.FC = () => {
    const [form, setForm] = useState<RegisterForm>({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        twoFactorEnabled: false,
    });

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [step, setStep] = React.useState<'form' | 'verify'>('form');
    const {register, sendCode} = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            await sendCode(form.email);
            setStep('verify');
        } catch (err) {
            console.log(err);
            setError('asd');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (form.password !== form.passwordConfirmation) {
            setError('Пароли не совпадают');
            return;
        }

        setLoading(true);

        try {
            await register({...form, verificationCode});
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Непридвиденная ошибка');
            }
        } finally {
            setLoading(false);
        }
    };

    if (step === 'form') {
        return (
            <div
                className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Регистрация</h2>

                    {error && (
                        <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSendCode} className="space-y-5">
                        <div>
                            <label htmlFor="firstname" className="block text-gray-700 mb-1">Имя</label>
                            <input
                                type="text"
                                id="firstname"
                                name="firstname"
                                value={form.firstname}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                placeholder="Ваше имя"
                            />
                        </div>

                        <div>
                            <label htmlFor="lastname" className="block text-gray-700 mb-1">Фамилия</label>
                            <input
                                type="text"
                                id="lastname"
                                name="lastname"
                                value={form.lastname}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                placeholder="Ваша фамилия"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-gray-700 mb-1">Пароль</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                placeholder="Минимум 6 символов"
                            />
                        </div>

                        <div>
                            <label htmlFor="passwordConfirmation" className="block text-gray-700 mb-1">Подтверждение
                                пароля</label>
                            <input
                                type="password"
                                id="passwordConfirmation"
                                name="passwordConfirmation"
                                value={form.passwordConfirmation}
                                onChange={handleChange}
                                required
                                minLength={6}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                placeholder="Повторите пароль"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-lg text-white font-semibold transition-colors ${
                                loading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                        >
                            {loading ? 'Загрузка...' : 'Зарегистрироваться'}
                        </button>
                    </form>
                </div>
            </div>
        );
    } else if (step === 'verify') {
        return (
            <div
                className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Регистрация</h2>

                    {error && (
                        <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-5">

                        <div>
                            <label htmlFor="passwordConfirmation" className="block text-gray-700 mb-1">Подтверждение
                                пароля</label>
                            <input
                                type="text"
                                id="code"
                                name="code"
                                value={verificationCode}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVerificationCode(e.target.value)}
                                required
                                minLength={6}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                placeholder="Введите код подтверждения"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-lg text-white font-semibold transition-colors ${
                                loading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                        >
                            {loading ? 'Загрузка...' : 'Зарегистрироваться'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return null;
};

export default RegisterPage;