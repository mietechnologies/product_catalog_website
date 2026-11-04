import { ToastProvider, useToast, Button } from 'mietech-catalog-ui';

function Triggers() {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap gap-3 p-4">
      <Button onClick={() => toast('Variant saved successfully.', 'success')}>Show success</Button>
      <Button variant="secondary" onClick={() => toast('Could not upload image.', 'error')}>Show error</Button>
      <Button variant="ghost" onClick={() => toast('Changes are saved automatically.', 'info')}>Show info</Button>
    </div>
  );
}

export const Triggering = () => (
  <ToastProvider>
    <Triggers />
  </ToastProvider>
);

function AutoShow() {
  const { toast } = useToast();
  const fired = (window as any).__toastsFired;
  if (!fired) {
    (window as any).__toastsFired = true;
    setTimeout(() => {
      toast('Variant saved successfully.', 'success');
      toast('Could not upload image.', 'error');
      toast('Changes are saved automatically.', 'info');
    }, 50);
  }
  return <div style={{ height: 260 }} />;
}

export const Stacked = () => (
  <ToastProvider>
    <AutoShow />
  </ToastProvider>
);
