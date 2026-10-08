import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PageHeader from "../../../../components/common/PageHeader";
import AddEditRole from "./AddEditRole";
import { ROLES_BASE_PATH } from "./rolePermissions" 

export default function CreateRole() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const goBack = () => navigate(ROLES_BASE_PATH);

  return (
    <div>
      <PageHeader
        title={isEdit ? "Edit Role" : "Create Role"}
        description={
          isEdit
            ? "Update the role name, status and permissions."
            : "Create a new role and assign its permissions."
        }
        action={
          <button
            onClick={goBack}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        }
      />

      <AddEditRole
        key={id || "new"}
        roleId={id}
        onCancel={goBack}
        onSuccess={(message) => navigate(ROLES_BASE_PATH, { state: { message } })}
      />
    </div>
  );
}