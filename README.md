# tailor-react-webpack

heavily opinionated setup for working in large / multiple teams.

## Prerequisites

make sure you have [jq](https://stedolan.github.io/jq) and [yarn](https://yarnpkg.com/) installed

Run the following to generate generic locale data user for pluralization etc:

```
yarn run intl:build-locale-data
```

Fetch remote translation objects by

```
yarn run intl:pull
```

New translation keys are created entirely within the repository itself. (Single source of truth)
See [Rect Intl](https://github.com/yahoo/react-intl)


## Contributing

(TBD)

### PhpStorm Config

[Open the Settings menu
](https://www.jetbrains.com/help/phpstorm/2016.3/accessing-settings.html#d949337e30)

#### Editorconfig

> Settings ▸ *search for `plugins`* ▸ *click `Install JetBrains Plugin`* ▸ *search for
> `editorconfig`* ▸ *click `install`*

#### maximum line length

> Settings ▸ *search for `right margin (columns)`* ▸ set to `100`

#### Resources Directories

The config for Resources Directories is provided via `.idea/webResources.xml` so by using PhpStorm,
you are set.

```xml
  <resourceRoots>
    <path value="file://$PROJECT_DIR$/src" />
    <path value="file://$PROJECT_DIR$" />
  </resourceRoots>
```
Read this [stackoverflow post
](http://stackoverflow.com/questions/34943631/path-aliases-for-imports-in-webstorm#37135031)
for deeper insights. 

Note this is is supposed to be in sync with the module-resolver config provided by `.babelrc`
(plugins section)

When updating the `.babelrc` modeule-resolver root entries, you could use jq to get a list of
directories you should also provide in the `<resourceRoots>` Section of `.idea/webResources.xml`.

```bash
 jq -r < .babelrc '.plugins[] |
    select(type=="array") |
    select(
      .[0]=="module-resolver"
    ) | .[1].root' 
```

Which results in the following 

```
[
  "./src",
  "./"
]
```

### i18n

Phraseapp: copy `.phraseapp.yml.example` to `.phraseapp.yml`, change the `<PROJECT_ID>` according to
the one of your own project. Don't touch `<locale_name>` and `<locale_code>` tho.

To run the `intl[:*]` tasks, a Phraseapp project needs to be in place with the languages named
`de-DE` and `en-US` as listed in appConfig.yaml:

```yaml
default_locale: de-DE
locales:
  - de-DE
  - en-US
```


There is a command to inspect the generated config:
```
yarn run conf:dump 
```

Or, just the localeMap:


```
yarn run conf:dump localeMap

# Beautified:
yarn run -s conf:dump localeMap | jq .

```

\# TODO:

Try [parrot](https://anthonynsimon.gitbooks.io/parrot)
as an alternative to phraseapp.

### Structure

    ▾ config/
        appConfig.yml

Application-wide config is meant to reside in `appConfig.yml`.

### Good to know

Given moment.js is incorporated in the project, when reconfiguring webpack, you might want to run the following to be sure the bundle contains only
the desired locales and no unwanted dependencies:

```bash
./scripts/check_locale_bundling.sh
```

