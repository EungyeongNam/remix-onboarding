import { useTable, useSortBy, useGlobalFilter } from "react-table";
import SearchForm from "./SearchForm";

const Table = (props: any) => {
  const { columns, data } = props;

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, setGlobalFilter } =
    useTable({ columns, data }, useGlobalFilter, useSortBy);

  return (
    <div className="mt-8 flex flex-col">
      <SearchForm onSubmit={setGlobalFilter} />

      <div
        className="shadow ring-1 ring-black ring-opacity-5 md:rounded-lg"
        style={{ overflowY: "auto" }}
      >
        <table {...getTableProps()} width={"100%"}>
          <thead className="bg-gray-50">
            {headerGroups.map((headerGroup) => (
              // eslint-disable-next-line react/jsx-key
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  // eslint-disable-next-line react/jsx-key
                  <>
                    {column.sortable === true ? (
                      <th
                        {...column.getHeaderProps(
                          column.sortable && column.getSortByToggleProps()
                        )}
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        style={{ textAlign: "left", cursor: 'pointer' }}
                      >
                        {column.render("Header")}
                        <span
                          style={{
                            marginLeft: "10px",
                            color: "rgb(127 127 127)",
                            fontSize: "0.8em",
                          }}
                        >
                          {column.isSorted
                            ? column.isSortedDesc
                              ? "내림차순"
                              : "오름차순"
                            : "기본정렬"}
                        </span>
                      </th>
                    ) : (
                      <th
                        {...column.getHeaderProps(
                          column.sortable && column.getSortByToggleProps()
                        )}
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        style={{ textAlign: "left" }}
                      >
                        {column.render("Header")}
                      </th>
                    )}
                  </>
                ))}
              </tr>
            ))}
          </thead>

          <tbody
            {...getTableBodyProps}
            className="divide-y divide-gray-200 bg-white"
          >
            {rows.map((row) => {
              prepareRow(row);
              return (
                // eslint-disable-next-line react/jsx-key
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    // eslint-disable-next-line react/jsx-key
                    <td
                      {...cell.getCellProps()}
                      className="px-3 py-4 text-sm text-gray-500"
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
