module.exports = {
  apps: [
    {
      name: 'roznamcha-ssr',
      script: 'bootstrap/ssr/ssr.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      kill_timeout: 5000,
      listen_timeout: 10000,
      wait_ready: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
