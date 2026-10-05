module.exports = {
    apps: [
        {
            name: "us-garment",
            script: "node_modules/next/dist/bin/next",
            args: "start",
            instances: 1,                 // 1 instance is best for low-resource VPS (1GB/2GB RAM)
            exec_mode: "fork",
            max_memory_restart: "800M",   // Safe memory threshold before PM2 restarts
            env: {
                NODE_ENV: "production",
                PORT: 3000,
                NODE_OPTIONS: "--max-old-space-size=768" // Guides Node garbage collector before PM2 restart
            }
        }
    ]
};
