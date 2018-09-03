# aws-assume-role

A basic CLI tool to make it easy to manage temporary STS credentials when assuming roles.

## Usage

Download the standalone executable ([OSX](https://s3.eu-west-2.amazonaws.com/aws-assume-role/assume_role-0.0.1-macos), [Linux](https://s3.eu-west-2.amazonaws.com/aws-assume-role/assume_role-0.0.1-linux), [Windows](https://s3.eu-west-2.amazonaws.com/aws-assume-role/assume_role-0.0.1-win.exe))

**NOTE** The initial invocation of the CLI tool is fairly latent.

### Warning

An (unencrypted) file-based cache of temporary credentials is used to prevent the need to re-authenticate whilst 'in session', so make sure your TTLs aren't too long!

### Reference

You can run `--help` to view all available options.

#### `--profile`

A named profile specified in `~/.aws/config` that you wish to assume the role of.

#### `---duration`

The duration of the session in seconds

#### `---cmd`

A CLI command that requires you to assume a role.

If omitted, the temporary credentials will outputted to stdout. If specified, the command will be run in a child process with the temporary credentials injected in as environment variables. This saves a few clicks, and means you don't end up polluting your current shell with superfluous variables.


## Contributing

1. Fork the repo.
2. Submit a PR against `jameshopkins/aws-assume-role`
