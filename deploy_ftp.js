import * as ftp from "basic-ftp";
import 'dotenv/config';

async function deploy() {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    try {
        await client.access({
            host: process.env.DEPLOY_FTP_HOST,
            user: process.env.DEPLOY_FTP_USER,
            password: process.env.DEPLOY_FTP_PASS,
            secure: false
        });
        
        console.log("Uploading Seeder...");
        await client.uploadFrom("database/seeders/KametiBlogPostSeeder.php", "rozapp/database/seeders/KametiBlogPostSeeder.php");
        
        console.log("Uploading public folder to public_html...");
        // Assuming public_html is the root for the public folder
        await client.ensureDir("public_html");
        await client.uploadFromDir("public");
        
        console.log("Uploading run_seeder.php...");
        await client.uploadFrom("run_seeder.php", "public_html/run_seeder.php");
        
    } catch(err) {
        console.error(err);
    }
    client.close();
}
deploy();
