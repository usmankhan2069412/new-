import React from "react";
import { toast as sonnerToast, Toast } from "sonner";
import { Check, X, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface CustomToastProps {
  title: string;
  message?: string;
  type?: ToastType;
  duration?: number;
  position?:
    | "top-right"
    | "top-center"
    | "top-left"
    | "bottom-right"
    | "bottom-center"
    | "bottom-left";
  action?: {
    label: string;
    onClick: () => void;
  };
}

const iconMap = {
  success: <Check className="h-5 w-5 text-green-500" />,
  error: <X className="h-5 w-5 text-red-500" />,
  warning: <AlertCircle className="h-5 w-5 text-amber-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
};

const bgColorMap = {
  success:
    "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
  error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
  warning:
    "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
  info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
};

export const customToast = ({
  title,
  message,
  type = "info",
  duration = 4000,
  position = "top-right",
  action,
}: CustomToastProps) => {
  sonnerToast.custom(
    (id) => (
      <div className={`rounded-lg border p-4 shadow-md ${bgColorMap[type]}`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">{iconMap[type]}</div>
          <div className="flex-1">
            <h3 className="font-medium text-foreground">{title}</h3>
            {message && (
              <p className="mt-1 text-sm text-muted-foreground">{message}</p>
            )}
          </div>
          {action && (
            <button
              onClick={() => {
                action.onClick();
                sonnerToast.dismiss(id);
              }}
              className="ml-auto rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              {action.label}
            </button>
          )}
        </div>
      </div>
    ),
    {
      duration,
      position,
    },
  );
};
