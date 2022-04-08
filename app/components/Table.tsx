import dayjs from "dayjs";
import { Link } from "remix";

type TableProps = {
  listItem: any[];
};

const Table = ({ listItem }: TableProps) => {
  return (
    <div className="mt-8 flex flex-col">
      <div
        className="shadow ring-1 ring-black ring-opacity-5 md:rounded-lg"
        style={{ overflowY: "auto" }}
      >
        <table width={"100%"} className="md:table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
              >
                아이디
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                이름
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                설명
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                할인
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                프로모션 기간
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                생성일
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                수정일
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                상태
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {listItem.map((item) => (
              <tr key={item.id}>
                <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  <code
                    style={{
                      display: "inline-block",
                      width: "170px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      backgroundColor: "rgba(243,244,246)",
                    }}
                  >
                    <Link to={`/promotions/${item.id}`}>{item.id}</Link>
                  </code>
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">{item.name}</td>
                <td className="px-3 py-4 text-sm text-gray-500">
                  {item.description}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">
                  {item.promotion_rate}%
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">
                  {dayjs(item.started_at).format("YYYY-MM-DD")} ~{" "}
                  {dayjs(item.ended_at).format("YYYY-MM-DD")}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">
                  {dayjs(item.created_at).format("YYYY-MM-DD HH:mm")}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">
                  {dayjs(item.updated_at).format("YYYY-MM-DD HH:mm")}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">
                  {item.is_active === true ? "진행중" : "마감"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
