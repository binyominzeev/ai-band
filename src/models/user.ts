class User {
    id: string;
    username: string;

    constructor(id: string, username: string) {
        this.id = id;
        this.username = username;
    }

    // Method to get user details
    getUserDetails() {
        return {
            id: this.id,
            username: this.username
        };
    }

    // Method to update username
    updateUsername(newUsername: string) {
        this.username = newUsername;
    }
}