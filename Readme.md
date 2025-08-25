
## **Project Name:** `cobit` 🔒💻

**Reason:** “Vault” conveys a secure place to store valuable things (your code). Simple, memorable, and professional.

---

# **README.md**

````markdown
# cobit

A secure and simple application to save, manage, and retrieve your code snippets effortlessly. Perfect for developers who want a personal code storage solution.

## Features

- Save and organize code snippets.
- Retrieve snippets quickly with search.
- Powered by PostgreSQL for secure storage.
- Easy to set up and run locally.

## Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** PostgreSQL  
- **Dockerized** for easy deployment

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/ManojGowda89/code-keeper.git
cd code-keeper
````

2. **Install dependencies**

```bash
npm i
```

3. **Create `.env` file**

```env
DB_URL=postgresql://admin:admin@datbase:5432/codekeeper
```

4. **Run the development server**

```bash
npm run dev
```

5. **Optional: Run with Docker**

```bash
docker build -t cobit .
docker run -d -p 80:5000 cobit
```

## Usage

* Open `http://localhost` in your browser (or the server URL you deployed to).
* Start saving and managing your code snippets instantly.

## Contributing

Feel free to open issues or submit pull requests. Let’s make coding more organized together!

## License

MIT License

```

---


