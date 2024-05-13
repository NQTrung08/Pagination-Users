import React, { useState, useEffect } from "react";
import { Button, Table } from "antd";
import { Pagination } from "antd";
import axios from "axios";

const columns = [
	{
		title: "User Name",
		dataIndex: "userName",
	},
	{
		title: "email",
		dataIndex: "email",
	},
	{
		title: "password",
		dataIndex: "password",
	},
];

const Users = () => {
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [loading, setLoading] = useState(false);
	const [userData, setUserData] = useState([]);
	const [currentPage, setCurentPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [pageSize, setPageSize] = useState("");

	useEffect(() => {
		fetchUserData();
	}, [currentPage]);

	const fetchUserData = async () => {
		try {
			setLoading(true);

			const response = await axios.get(
				`http://localhost:8080/api/users/?page=${currentPage}&limit=${pageSize}`
			);

			const data = response.data.users.map((item) => {
				return {
					key: item.id,
					...item,
				};
			});

			console.log(response.data);
			setUserData(data);
			setTotal(response.data.total);
			setPageSize(response.data.pageSize);
		} catch (error) {
			console.error("Error fetching user data:", error);
		} finally {
			setLoading(false);
		}
	};

	const start = () => {
		setLoading(true);
		// ajax request after empty completing
		setTimeout(() => {
			setSelectedRowKeys([]);
			setLoading(false);
		}, 1000);
	};
	const onSelectChange = (newSelectedRowKeys) => {
		console.log("selectedRowKeys changed: ", newSelectedRowKeys);
		setSelectedRowKeys(newSelectedRowKeys);
	};
	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};
	const hasSelected = selectedRowKeys.length > 0;

	const onChange = (pageNumber) => {
		setCurentPage(pageNumber);
	};

	const hanldeDelete = async () => {
		try {
			setLoading(true);
			const response = await axios.delete(
				`http://localhost:8080/api/users/delete`,
				{ data: { ids: selectedRowKeys } }
			);
			console.log("Delete response:", response.data);
			setSelectedRowKeys([]);
			fetchUserData();
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<section>
			<div>
				<div
					style={{
						marginBottom: 16,
					}}
				>
					<Button
						type="primary"
						onClick={hanldeDelete}
						disabled={!hasSelected}
						loading={loading}
					>
						Delete
					</Button>

					<span
						style={{
							marginLeft: 8,
						}}
					>
						{hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
					</span>
				</div>
				<Table
					rowSelection={rowSelection}
					pagination={false}
					columns={columns}
					dataSource={userData}
				/>
				<Pagination
					defaultCurrent={1}
					onChange={onChange}
					pageSize={pageSize}
					total={total}
				/>
				;
			</div>
		</section>
	);
};

export default Users;
