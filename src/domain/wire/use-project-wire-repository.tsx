export const useProjectWireRepository = () => {
    // const db = useSQLiteContext();

    // return useMemo(() => ({
    //     findByProjectId: (projectId: number): Promise<ProjectWire | void> => db
    //         .getFirstAsync(`SELECT * FROM t_project_wires WHERE project_id = ?`, projectId)
    //         .then(v => ProjectWire.createFromDB(v))
    //         .catch((e) => console.error(e)),
    //     insert: (projectId: number, wire: Wire) => db
    //         .runAsync(`INSERT INTO t_project_wires (
    //             project_id, 
    //             diameter, placement, wire_type, phase, length
    //             ) VALUES (?,?,?,?,?,?)`,
    //             projectId,
    //             wire.diameter.key,
    //             wire.placement,
    //             wire.type,
    //             wire.phase.id,
    //             wire.length,
    //         )
    //         .catch((e) => console.error(e)),
    //     update: (projectWire: ProjectWire) => db
    //         .runAsync(`UPDATE t_project_wires 
    //             SET diameter=?, placement=?, wire_type=?, phase=?, length=? 
    //             WHERE project_id=?
    //         `,
    //             projectWire.diameter.key,
    //             projectWire.placement,
    //             projectWire.type,
    //             projectWire.phase.id,
    //             projectWire.length,
    //             projectWire.projectId)
    //         .catch((e) => console.error(e)),
    //     deleteByProjectId: (projectId: number) => db.runAsync(`DELETE FROM t_project_wires WHERE project_id=?`, projectId),
    //     drop: () => db.runAsync(`DROP TABLE IF EXISTS t_project_wires`),
    // }), [db]);
    return {

    }
}