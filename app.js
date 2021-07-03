require("colors");

const {
    inquirerMenu,
    pausa,
    leerInput,
    listadoTareasBorrar,
    confirmar,
    mostrarListadoChecklist
} = require("./helpers/inquirer");

const { guardarDB, leerArchivo } = require("./helpers/guardarArchivo");

const Tareas = require("./models/tareas");

const main = async () => {
    let opt = "";
    const tareas = new Tareas();
    const lista = leerArchivo();

    if (lista) {
        tareas.cargarTareas(lista);
    }

    do {
        opt = await inquirerMenu();

        switch (opt) {
            case "1":
                const desc = await leerInput("Descripcion: ");
                tareas.crearTarea(desc);
                break;
            case "2":
                tareas.listadoCompleto();
                break;
            case "3":
                tareas.listarPendientesCompletadas(true);
                break;
            case "4":
                tareas.listarPendientesCompletadas(false);
                break;
            case "5":
                const ids = await mostrarListadoChecklist(tareas.listadoArr);
                tareas.toggleCompletadas(ids);
                break;
            case "6":
                const id = await listadoTareasBorrar(tareas.listadoArr);
                const ok = await confirmar("¿Esta seguro que desea borrarlo?");

                if (ok) {
                    tareas.borrarTarea(id);
                }

                break;
        }

        guardarDB(tareas.listadoArr);

        await pausa();

    } while (opt !== "0");
}

main();