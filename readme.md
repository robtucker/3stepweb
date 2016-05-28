### Installation

```
git clone git@bitbucket.org:robtucker/3stepweb.git
vagrant up
```


### Development

```
npm update
bower update
gulp
```

### Production

```
./ansible -K --limit production provision.yml
```
