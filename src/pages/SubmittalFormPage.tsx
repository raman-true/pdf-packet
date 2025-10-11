import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useFormStore } from '../store/useFormStore';
import { Input } from '../components/Input';
import { Checkbox } from '../components/Checkbox';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PRODUCT_SIZES } from '../constants/documents';

interface SubmittalFormPageProps {
  onNext: () => void;
}

export function SubmittalFormPage({ onNext }: SubmittalFormPageProps) {
  const { formData, updateFormData, isFormValid } = useFormStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3">
          MAXTERRA® Submittal Form
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Enter your project details to begin creating a custom packet
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card variant="elevated">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-5">
            Project Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Submitted To *"
              value={formData.submittedTo}
              onChange={(e) => updateFormData({ submittedTo: e.target.value })}
              placeholder="Company or person name"
              required
            />
            <Input
              label="Project Name *"
              value={formData.projectName}
              onChange={(e) => updateFormData({ projectName: e.target.value })}
              placeholder="Project name"
              required
            />
            <Input
              label="Project Number"
              value={formData.projectNumber}
              onChange={(e) => updateFormData({ projectNumber: e.target.value })}
              placeholder="Optional project number"
            />
            <Input
              label="Prepared By *"
              value={formData.preparedBy}
              onChange={(e) => updateFormData({ preparedBy: e.target.value })}
              placeholder="Your name"
              required
            />
            <Input
              label="Phone/Email *"
              value={formData.phoneEmail}
              onChange={(e) => updateFormData({ phoneEmail: e.target.value })}
              placeholder="Contact information"
              required
            />
            <Input
              label="Date *"
              type="date"
              value={formData.date}
              onChange={(e) => updateFormData({ date: e.target.value })}
              required
            />
          </div>
        </Card>

        <Card variant="elevated">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Status / Action
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Checkbox
              label="For Review"
              checked={formData.status.forReview}
              onChange={(e) =>
                updateFormData({
                  status: { ...formData.status, forReview: e.target.checked },
                })
              }
            />
            <Checkbox
              label="For Record"
              checked={formData.status.forRecord}
              onChange={(e) =>
                updateFormData({
                  status: { ...formData.status, forRecord: e.target.checked },
                })
              }
            />
            <Checkbox
              label="For Approval"
              checked={formData.status.forApproval}
              onChange={(e) =>
                updateFormData({
                  status: { ...formData.status, forApproval: e.target.checked },
                })
              }
            />
            <Checkbox
              label="For Information Only"
              checked={formData.status.forInformationOnly}
              onChange={(e) =>
                updateFormData({
                  status: { ...formData.status, forInformationOnly: e.target.checked },
                })
              }
            />
          </div>
        </Card>

        <Card variant="elevated">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Submittal Type
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Checkbox
              label="ESR"
              checked={formData.submittalType.esr}
              onChange={(e) =>
                updateFormData({
                  submittalType: { ...formData.submittalType, esr: e.target.checked },
                })
              }
            />
            <Checkbox
              label="Part Special"
              checked={formData.submittalType.partSpecial}
              onChange={(e) =>
                updateFormData({
                  submittalType: { ...formData.submittalType, partSpecial: e.target.checked },
                })
              }
            />
            <Checkbox
              label="Test Report ICC-ES93"
              checked={formData.submittalType.testReportICC}
              onChange={(e) =>
                updateFormData({
                  submittalType: { ...formData.submittalType, testReportICC: e.target.checked },
                })
              }
            />
            <Checkbox
              label="Test Report IBC 1416"
              checked={formData.submittalType.testReportIBC}
              onChange={(e) =>
                updateFormData({
                  submittalType: { ...formData.submittalType, testReportIBC: e.target.checked },
                })
              }
            />
            <Checkbox
              label="Test Report ASTM"
              checked={formData.submittalType.testReportASTM}
              onChange={(e) =>
                updateFormData({
                  submittalType: { ...formData.submittalType, testReportASTM: e.target.checked },
                })
              }
            />
            <Checkbox
              label="Material Safety Data Sheet (MSDS)"
              checked={formData.submittalType.materialSafetyDataSheet}
              onChange={(e) =>
                updateFormData({
                  submittalType: {
                    ...formData.submittalType,
                    materialSafetyDataSheet: e.target.checked,
                  },
                })
              }
            />
            <Checkbox
              label="LEED Guide"
              checked={formData.submittalType.leedGuide}
              onChange={(e) =>
                updateFormData({
                  submittalType: { ...formData.submittalType, leedGuide: e.target.checked },
                })
              }
            />
            <Checkbox
              label="Installation Guide"
              checked={formData.submittalType.installationGuide}
              onChange={(e) =>
                updateFormData({
                  submittalType: {
                    ...formData.submittalType,
                    installationGuide: e.target.checked,
                  },
                })
              }
            />
            <Checkbox
              label="Warranty"
              checked={formData.submittalType.warranty}
              onChange={(e) =>
                updateFormData({
                  submittalType: { ...formData.submittalType, warranty: e.target.checked },
                })
              }
            />
            <Checkbox
              label="Other"
              checked={formData.submittalType.other}
              onChange={(e) =>
                updateFormData({
                  submittalType: { ...formData.submittalType, other: e.target.checked },
                })
              }
            />
          </div>
        </Card>

        <Card variant="elevated">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Product
          </h2>
          <Select
            label="Product Size *"
            value={formData.productSize}
            onChange={(e) => updateFormData({ productSize: e.target.value })}
            options={[
              { value: '', label: 'Select size...' },
              ...PRODUCT_SIZES.map((size) => ({ value: size, label: size })),
            ]}
            required
          />
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={!isFormValid()}>
            Continue to Document Selection
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
