module.exports = {
  apps: [
    {
      name: 'roznamcha-ssr',
      script: 'bootstrap/ssr/ssr.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      kill_timeout: 5000,
      listen_timeout: 10000,
      wait_ready: false,
      env: {
        NODE_ENV: 'production',
        PORT: 13714,
        UV_THREADPOOL_SIZE: '1',
      },
    },
  ],
};
