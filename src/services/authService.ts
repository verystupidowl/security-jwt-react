export const login = async (email: string, password: string) => {
    const res = await fetch("http://localhost:8080/api/v1/auth/authenticate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password}),
    });

    if (!res.ok) {
        throw new Error("Ошибка входа");
    }

    return res.json();
}