# Manladag command line

[Manladag](https://github.com/Zepoze/manladag-source) cli is rapid program for the processing of manga's chapter from the web

* Download
* Viewer


## Installation

Use the package manager [npm](https://www.npmjs.com/) to install Manladag.

```bash
sudo npm install --global @manladag/cli
```

## Usage

```bash
$ manladag --help
manladag <commande>

Commandes :
  manladag download [path]          download a chapter of given source and manga
  manladag viewer <cmd> [filename]  command  in order to view a .mlag file from
                                    manladag

Options :
  --version    [booléen]
  --help            
```
### Download

```bash
# Example 1
$ manladag download -s lelscanv -m one-piece -c 975
```
The chapter One Piece n°975 will be download in the current directory into a default name `.mlag` file

```bash
# Example 2
$ manladag download -s lelscanv -m dr-stone -c 150 ~/Desktop/manga1
```
The chapter Dr Stone n°150 will be download in the current directory into the file `~/Desktop/manga1.mlag`

```bash
# For more info
$ manladag download --help
```

### Viewer
Downloading is good but reading the manga is even better.

```bash
# Example web server
$ manladag viewer serve . ~/Desktop/manga1.mlag
```
The mlag File into the current directory and the file `~/Desktop/manga1.mlag` are now available on [http://localhost:1854](http://127.0.0.1:1854)

```bash
# For more info
$ manladag viewer --help
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.


## License
GPL-3.0 License
