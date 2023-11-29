import argparse
import subprocess
import os
from datetime import datetime
import questionary


def get_args():
    parser = argparse.ArgumentParser(
        description="Upload files or folders to R2 bucket."
    )
    parser.add_argument(
        "-p", "--path", type=str, help="Path to the folder or file to upload"
    )
    parser.add_argument(
        "-proj", "--project", type=str, help="Project name for the upload destination"
    )
    parser.add_argument(
        "-b", "--bucket", type=str, default="phageaus", help="Bucket name"
    )
    parser.add_argument(
        "-r",
        "--rcloneResource",
        type=str,
        default="r2phaus",
        help="Rclone resource name",
    )
    return parser.parse_args()


def run_command(command):
    try:
        subprocess.run(command, shell=True, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")


def main():
    args = get_args()

    # Check if the required arguments are provided, if not use questionary
    if not args.path or not args.project:
        answers = questionary.prompt(
            [
                {
                    "type": "input",
                    "name": "path",
                    "message": "Enter the path to the folder or file you want to upload:",
                    "default": args.path or "",
                },
                {
                    "type": "input",
                    "name": "project",
                    "message": "Enter the project name for the upload destination:",
                    "default": args.project or "",
                },
                {
                    "type": "input",
                    "name": "bucket",
                    "message": "Enter the bucket name:",
                    "default": args.bucket or "phageaus",
                },
                {
                    "type": "input",
                    "name": "rcloneResource",
                    "message": "Enter the rclone resource name:",
                    "default": args.rcloneResource or "r2phaus",
                },
            ]
        )
        args.path = answers["path"]
        args.project = answers["project"]
        args.bucket = answers["bucket"]
        args.rcloneResource = answers["rcloneResource"]
    else:
        # Use the provided command line arguments
        args.bucket = args.bucket or "phageaus"
        args.rcloneResource = args.rcloneResource or "r2phaus"

    source_path = os.path.abspath(args.path)
    folder_name = os.path.basename(source_path)
    date = datetime.now().strftime("%Y-%m-%d")
    destination_path = f"{args.bucket}/{args.project}/{folder_name}/{date}/"

    rclone_command = (
        f"rclone copy {source_path} {args.rcloneResource}:{destination_path}"
    )
    rclone_list_command = f"rclone tree {args.rcloneResource}:{destination_path}"

    print(f"Uploading to: {args.rcloneResource}:{destination_path}")
    run_command(rclone_command)
    print("Upload completed!")
    run_command(rclone_list_command)


if __name__ == "__main__":
    main()
