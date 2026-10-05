module.exports = {
    apps: [
        {
            name: "us-garment",
            script: "node_modules/next/dist/bin/next",
            args: "start",
            instances: 1,
            exec_mode: "fork",
            max_memory_restart: "800M",
            env: {
                NODE_ENV: "production",
                PORT: 3001, // 👈 Changed from 3000 to 3001
                NODE_OPTIONS: "--max-old-space-size=768"
            }
        }
    ]
};
