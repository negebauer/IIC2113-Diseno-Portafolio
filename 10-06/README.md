### Conventional Commits

En un desarrollo de software lo ideal hoy es usar una herramienta para registrar los cambios al proyecto como [git](https://git-scm.com). Esta permite registrar cada cambio al código, tener distintas línas de cambios (branches) y usar estrategias de trabajo como [git flow](https://datasift.github.io/gitflow/IntroducingGitFlow.html).

A la hora de usar estas herramientas, los commits se vuelven muy importantes. Esto dado que su descripción es muy importante a la hora de ver todos los cambios del proyecto para saber que ha cambiado cada vez. Un problema recurrente con esto es que distintas personas hacen commits de distinta forma. Esto hace difícil para externos saber, por ejemplo, como ha evolucionado una librería.

Para solucionar este problema existen los [commits convencionales](https://conventionalcommits.org). En resumen, esto da una regla base para definir como debe ser un commit. La estructura de un commit convencional es:

--

_tipo_(contexto opcional): descripción del commit

Cuerpo del commit

Pie del commit

--

Para el tipo de commit existen 2 básicos definidos por conventionalcommits, estos son `feat` y `fix`. `feat` es el tipo a usar cuando un commit introduce una nueva feature al programa. `fix` es cuando el commit arregla un error dentro del programa. Se pueden usar otros tipos de commits definidos por proyecto, por ejemplo: `chore`, `deploy`, `dependencies`.

El contexto es opcional. Este permite dar un contexto al commit. Por ejemplo, si se desarrolla una nueva feature relacionado con la interfaz de linea de comando (cli), el commit podría ser algo como `feat(cli): Allows more params in cli call`.

La descripción del commit debe describir de manera resumida lo que hace el commit.

Luego le sigue el cuerpo, este puede tener comentarios adicionales sobre lo hecho.

Y finalmente el pie del commit. Este contiene metada adicional sobre el commit. Por ejemplo, puede hacer referencia a issues de Github que se arreglan con el commit (`fix #4` por ejemplo). Esto permite cerrar las issues cuando se hace el merge a la branch por defecto y que quede la conexión problema-solución.

También, si se introucen cambios que rompen APIs anteriores del programa esto debe ser señalado en el cuerpo o pie con el mensaje `BREAKING CHANGE: descripción cambio`. Por ejemplo:

--

_feat_(cli): cli allows multiple params

BREAKING CHANGE: cli params take precedence over env variables

--

Si se siguen estas reglas la historia de commits de un repositorio es mucho más fácil de entender para todos.
