
# Uploader

We use this tool for Phage Australia for backing up folders and files — like Google Drive and analyses from genomics runs. This simple tool helps us put folders into "project" directories, then appends the upload date to the end. Usually when you upload to R2 (e.g. via rclone) the previous files get overwritten — not ideal if you want to keep historical records! With this tool, every upload is tracked by upload date.

This uploads files and folders to a Cloudflare R2 bucket [default: "phageaus"] with a path like: /project/folder/date.

(Note that if you upload multiple times within the same date, it WILL overwrite the folder; this gives us some flexibility in case we make mistakes)


## Installation & Usage

- Install rclone: `brew install rclone`
- Set up rclone with r2 configurations by editing `rclone.conf` (for Mac, usually under `/Users/USER_NAME/.config/rclone/rclone.conf`) and add these lines. Get the keys from Cloudflare or your admin.
```
[r2phaus]
type = s3
provider = Cloudflare
access_key_id = ACCESS_KEY
secret_access_key = SECRET_ACCESS_KEY
endpoint = https://ACCOUNT_ID.r2.cloudflarestorage.com
acl = private
no_check_bucket = true
```

### Node Installation
- `brew install node` install node if you haven't (or preferably, use nvm)
- `yarn install` install node dependencies
- `chmod +x index.mjs` make index.mjs executable
- `npm link` allows you to type `uploader --flags` to run it in CLI
- `npm unlink` to uninstall

### Node Usage
- Use interactive CLI: type `uploader` then follow prompts
- Use flags: `uploader -h` for commands / help
  - Example, if you try to upload folder "test": `uploader --path ./test --project my-test-project`

### Python Installation
These are rough guidelines; please adjust to your environment
- `python3.11 -m venv uploader_env` setup a virtual environment
- `source uploader_env/bin/activate` start the virtual env
- `python -m pip install questionary prompt_toolkit` install dependencies

### Python Usage
- Use interactive CLI: `python3 uploader.py` then follow prompts
- Use flags: `python3 uploader.py -h` for commands / help
  - Example, if you try to upload folder "test": `python3 uploader.py --path ./test --project my-test-project`


---

This code was co-written with GPT-4.