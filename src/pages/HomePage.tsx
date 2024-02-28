import {createColumnHelper, getCoreRowModel, useReactTable, getSortedRowModel} from "@tanstack/react-table";
import React, {useEffect, useState} from "react";
import ImagePreview from "../components/ImagePreview";
import CustomTable from "../components/Table/CustomTable";
import IndeterminateCheckbox from "../components/Table/IndeterminateCheckbox";
import PartsTable from "../components/Table/PartsTable";
import TextCell from "../components/Table/TextCell";
import ToolsTable from "../components/Table/ToolsTable";
import {useGetAllProgramsQuery} from "../redux/api/programsApi";
import {IProgram} from "../redux/api/types";


const columnHelper = createColumnHelper<IProgram>()
const columns = [
    columnHelper.display({
        id: 'select',
        header: ({table}) => (
            <IndeterminateCheckbox
                {...{
                    checked: table.getIsAllRowsSelected(),
                    indeterminate: table.getIsSomeRowsSelected(),
                    onChange: table.getToggleAllRowsSelectedHandler(),
                }}
            />
        ),
        cell: ({row}) => (
            <IndeterminateCheckbox
                {...{
                    checked: row.getIsSelected(),
                    disabled: !row.getCanSelect(),
                    indeterminate: row.getIsSomeSelected(),
                    onChange: row.getToggleSelectedHandler(),
                }}
            />
        ),
    }),
    columnHelper.accessor("programId", {
        cell: info => <TextCell text={info.getValue()}/>,
        header: "ID"
    }),
    columnHelper.accessor("name", {
            cell: info => <TextCell text={info.getValue()}/>,
            header: "Name",
            enableSorting: true,
        }
    ),
    columnHelper.accessor("blank", {
            cell: info => {
                const blank = info.getValue()
                return (
                    <TextCell text={`${blank.width} x ${blank.length} x ${blank.height}`}/>
                )
            },
            header: "Blank",
            enableSorting: true,

        }
    ),

    columnHelper.accessor("machiningTime", {
            cell: info => <TextCell text={info.getValue().toString()}/>,
            header: "Time",
            enableSorting: true,
        }
    ),
    columnHelper.accessor("comment", {
            cell: info => <TextCell text={info.getValue()}/>,
            header: "Comment",
            enableSorting: true,
        }
    ),
]
const selectedColumns = [
    columnHelper.accessor("name", {
            cell: info => <TextCell text={info.getValue()}/>,
            header: "Name",
            enableSorting: true,
        }
    ),
]
const HomePage = () => {
    const {isLoading, isError, error, data: programs = []} = useGetAllProgramsQuery();
    const [selectedProgram, setSelectedProgram] = useState<IProgram | null>(null)
    const [selectedPrograms, setSelectedPrograms] = useState<IProgram[]>([])
    const [rowSelection, setRowSelection] = React.useState({})
    const [oldRowSelection, setOldRowSelection] = React.useState({})

    useEffect(() => {
        const newIds = Object.keys(rowSelection)

        let newList =selectedPrograms.filter(value => newIds.includes(value.id))

        newIds.forEach(id => {
            const program = newList.find(value => value.id === id)

            if (program === undefined) {
                const program = programs.find(value => value.id === id)
                program && newList.push(program)
            }
        })
        setSelectedPrograms(newList)

    }, [rowSelection])


    const programsTable = useReactTable({
        data: programs,
        columns: columns,
        state: {
            rowSelection
        },
        getRowId: originalRow => originalRow.id,
        enableSorting: true,
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })


    const selectedProgramsTable = useReactTable({
        data: selectedPrograms,
        columns: selectedColumns,
        getCoreRowModel: getCoreRowModel(),
    })


    return (
        <div className="flex flex-col gap-2 h-full p-2">

            <CustomTable table={programsTable} onRowClick={setSelectedProgram} className="flex-1 min-h-0 h-full"/>
            <div className="h-[350px]  gap-2 flex">

                <CustomTable table={selectedProgramsTable} className="w-full"/>
                <PartsTable parts={selectedProgram?.parts} className="w-fit"/>
                <ToolsTable tools={selectedProgram?.tools} className="w-fit"/>
                <ImagePreview url={selectedProgram?.files.preview.url ?? ''}
                              alt={selectedProgram?.name ?? "Program Name"}/>
            </div>
        </div>
    );
};

export default HomePage;