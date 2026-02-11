"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  X, 
  Phone, 
  Trash2,
  Package,
  Calendar,
  User,
  Building2
} from "lucide-react";

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        status,
        search,
      });

      const response = await fetch(`/api/admin/suppliers?${params}`);
      const data = await response.json();

      if (data.success) {
        setSuppliers(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [page, status]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchSuppliers();
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch("/api/admin/suppliers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        fetchSuppliers();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteSupplier = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا الطلب؟")) return;

    try {
      const response = await fetch(`/api/admin/suppliers?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        fetchSuppliers();
      }
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      approved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
      contacted: "bg-blue-100 text-blue-800 border-blue-200",
    };

    const labels = {
      pending: "قيد المراجعة",
      approved: "مقبول",
      rejected: "مرفوض",
      contacted: "تم التواصل",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">طلبات تسجيل الموردين</h1>
          <p className="text-gray-600">إدارة ومراجعة طلبات الموردين الجدد</p>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="البحث بالاسم، الشركة، أو المنتجات..."
                  className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </form>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white min-w-[180px]"
              >
                <option value="all">جميع الحالات</option>
                <option value="pending">قيد المراجعة</option>
                <option value="approved">مقبول</option>
                <option value="rejected">مرفوض</option>
                <option value="contacted">تم التواصل</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border-r-4 border-yellow-500">
            <div className="text-sm text-gray-600 mb-1">قيد المراجعة</div>
            <div className="text-2xl font-bold text-gray-900">
              {suppliers.filter(s => s.status === "pending").length}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-r-4 border-green-500">
            <div className="text-sm text-gray-600 mb-1">مقبول</div>
            <div className="text-2xl font-bold text-gray-900">
              {suppliers.filter(s => s.status === "approved").length}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-r-4 border-blue-500">
            <div className="text-sm text-gray-600 mb-1">تم التواصل</div>
            <div className="text-2xl font-bold text-gray-900">
              {suppliers.filter(s => s.status === "contacted").length}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-r-4 border-red-500">
            <div className="text-sm text-gray-600 mb-1">مرفوض</div>
            <div className="text-2xl font-bold text-gray-900">
              {suppliers.filter(s => s.status === "rejected").length}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : suppliers.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <Package size={48} className="mx-auto mb-4 text-gray-400" />
              <p>لا توجد طلبات</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">الشركة</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">المسؤول</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">التواصل</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">المنتجات</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">التاريخ</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">الحالة</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {suppliers.map((supplier) => (
                    <tr key={supplier.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 size={16} className="text-gray-400" />
                          <span className="font-medium text-gray-900">{supplier.company_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-gray-400" />
                          <span className="text-gray-700">{supplier.contact_person}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-gray-400" />
                          <span className="text-gray-700 text-sm">{supplier.contact_info}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {supplier.products_services}
                        </div>
                        {supplier.additional_notes && (
                          <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                            {supplier.additional_notes}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={14} className="text-gray-400" />
                          {formatDate(supplier.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(supplier.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {supplier.status !== "approved" && (
                            <button
                              onClick={() => updateStatus(supplier.id, "approved")}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="قبول"
                            >
                              <Check size={18} />
                            </button>
                          )}
                          {supplier.status !== "rejected" && (
                            <button
                              onClick={() => updateStatus(supplier.id, "rejected")}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="رفض"
                            >
                              <X size={18} />
                            </button>
                          )}
                          {supplier.status !== "contacted" && (
                            <button
                              onClick={() => updateStatus(supplier.id, "contacted")}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="تم التواصل"
                            >
                              <Phone size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => deleteSupplier(supplier.id)}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            title="حذف"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && suppliers.length > 0 && (
            <div className="border-t px-6 py-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                إجمالي: {pagination.total} طلب
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} />
                </button>
                <div className="px-4 py-2 border rounded-lg">
                  صفحة {page} من {pagination.totalPages}
                </div>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= pagination.totalPages}
                  className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}