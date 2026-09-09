<?php
$zip = new ZipArchive;
if ($zip->open(__DIR__.'/../hotfix.zip') === TRUE) {
    $zip->extractTo(__DIR__.'/../');
    $zip->close();
    echo 'Extracted successfully';
} else {
    echo 'Failed to extract';
}
unlink(__DIR__.'/../hotfix.zip');
unlink(__FILE__);
