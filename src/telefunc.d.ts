export {};

declare global {
    namespace Telefunc {
        interface Context {
            user: {
                id: number;
                username: string;
                isAdmin: boolean;
            } | null;
        }
    }
}
