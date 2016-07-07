### Installation

add to your hosts file:


```
git clone git@bitbucket.org:robtucker/3stepweb.git
cd 3stepweb
vagrant up
```

### Production

```
./ansible -K --limit production provision.yml
```
