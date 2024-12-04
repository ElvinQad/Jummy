import { useState, useEffect } from "react";
import { api } from "../../../lib/axios";
import { RefreshCcw } from "lucide-react";
import { useToast } from "../../../components/ui/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";

type Category = {
  id: number;
  name: string;
  slug: string;
  image: string;
  description: string;
  parentId: number | null;
};

type File = {
  filename: string;
  mimetype: string;
};

type ChefApplication = {
  id: number;
  businessName: string;
  description: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  certificateFiles: File[];
  documentFiles: File[];
  reviewNotes: string | null;
  reviewedAt: string | null;
  mainCategories: Category[];
  subCategories: Category[];
  user: {
    email: string;
    profile: {
      firstName: string;
      lastName: string;
    };
  };
};

export default function ChefApplicationManagement() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<ChefApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<ChefApplication | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await api.get("/chef-applications");
      setApplications(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch applications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    id: number,
    status: "APPROVED" | "REJECTED",
    reviewNotes: string = ""
  ) => {
    try {
      await api.put(`/chef-applications/${id}/status`, { status, reviewNotes });
      fetchApplications();
      toast({
        title: "Status Updated",
        description: `Application ${status.toLowerCase()} successfully`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    }
  };

  const filteredApplications = applications.filter(
    (app) =>
      app.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${app.user.profile.firstName} ${app.user.profile.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 p-6">
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search applications..."
          className="max-w-sm bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card className="bg-white dark:bg-gray-900/80 border-gray-200 dark:border-gray-800">
        <CardHeader className="border-b border-gray-200 dark:border-gray-800">
          <CardTitle className="text-gray-900 dark:text-gray-100">
            Applications
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Total applications: {applications.length}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200 dark:border-gray-800 hover:bg-transparent">
                <TableHead className="text-gray-500 dark:text-gray-400">
                  Business Name
                </TableHead>
                <TableHead className="text-gray-500 dark:text-gray-400">
                  Applicant
                </TableHead>
                <TableHead className="text-gray-500 dark:text-gray-400">
                  Email
                </TableHead>
                <TableHead className="text-gray-500 dark:text-gray-400">
                  Description
                </TableHead>
                <TableHead className="text-gray-500 dark:text-gray-400">
                  Status
                </TableHead>
                <TableHead className="text-right text-gray-500 dark:text-gray-400">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-gray-500 dark:text-gray-400 py-8"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCcw className="h-4 w-4 animate-spin" />
                      Loading applications...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredApplications.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-gray-500 dark:text-gray-400 py-8"
                  >
                    No applications found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredApplications.map((application) => (
                  <TableRow
                    key={application.id}
                    className="border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/70"
                  >
                    <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                      {application.businessName}
                    </TableCell>
                    <TableCell className="text-gray-500 dark:text-gray-400">
                      {application.user.profile.firstName}{" "}
                      {application.user.profile.lastName}
                    </TableCell>
                    <TableCell className="text-gray-500 dark:text-gray-400">
                      {application.user.email}
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300 truncate max-w-xs">
                      {application.description}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded text-sm ${
                          application.status === "APPROVED"
                            ? "bg-green-600"
                            : application.status === "REJECTED"
                            ? "bg-red-600"
                            : "bg-yellow-600"
                        }`}
                      >
                        {application.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedApplication(application)}
                        >
                          View Details
                        </Button>
                        {application.status === "PENDING" && (
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white transition-colors"
                              onClick={() =>
                                handleStatusUpdate(application.id, "APPROVED")
                              }
                            >
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="hover:bg-red-700 bg-red-600/80 transition-colors"
                              onClick={() =>
                                handleStatusUpdate(application.id, "REJECTED")
                              }
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Business Information</h3>
                  <p>Name: {selectedApplication.businessName}</p>
                  <p>Description: {selectedApplication.description}</p>
                  <p>Status: {selectedApplication.status}</p>
                  <p>Created: {new Date(selectedApplication.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Applicant Information</h3>
                  <p>Name: {selectedApplication.user.profile.firstName} {selectedApplication.user.profile.lastName}</p>
                  <p>Email: {selectedApplication.user.email}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold">Main Categories</h3>
                <div className="flex gap-2 flex-wrap">
                  {selectedApplication.mainCategories.map(cat => (
                    <span key={cat.id} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                      {cat.name}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold">Sub Categories</h3>
                <div className="flex gap-2 flex-wrap">
                  {selectedApplication.subCategories.map(cat => (
                    <span key={cat.id} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                      {cat.name}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold">Documents</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Certificates</h4>
                    <ul className="list-disc list-inside">
                      {selectedApplication.certificateFiles.map(file => (
                        <li key={file.filename}>{file.filename}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium">Other Documents</h4>
                    <ul className="list-disc list-inside">
                      {selectedApplication.documentFiles.map(file => (
                        <li key={file.filename}>{file.filename}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {selectedApplication.reviewNotes && (
                <div>
                  <h3 className="font-semibold">Review Notes</h3>
                  <p>{selectedApplication.reviewNotes}</p>
                  <p className="text-sm text-gray-500">
                    Reviewed at: {new Date(selectedApplication.reviewedAt!).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
