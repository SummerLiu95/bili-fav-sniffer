import {
    Button,
    Col,
    Divider,
    Drawer,
    Row,
    Upload,
    UploadProps,
    Typography,
    QRCode,
    message,
    Descriptions,
    Avatar
} from 'antd';
import styles from '@/styles/components/setting-drawer.module.scss';
import React, {useEffect} from 'react';
import {UploadChangeParam} from 'antd/es/upload';
import {LocalStorageKey, UserInfo} from '@/const';

const { Title } = Typography;

interface SettingProps {
    open: boolean;
    nextInvocationTime: string;
    drawerOnClose: () => void;
    uploadOnChange: (info: UploadChangeParam) => void;
}
export default function SettingDrawer({open, drawerOnClose, nextInvocationTime, uploadOnChange}: SettingProps) {
    const [qrcode, setQrcode] = React.useState('text');
    const [qrcodeStatus, setQrcodeStatus] = React.useState('active' as "loading" | "active" | "expired");
    const [userInfo, setUserInfo] = React.useState<UserInfo>();

    const props: UploadProps = {
        name: 'file',
        action: '/api/upload',
        accept: ".json",
        showUploadList: false,
        onChange(info) {
            uploadOnChange(info);
        },
    };
    const exportConfig = async () => {
        try {
            const res = await fetch('/api/export')
            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'config.json' // 设置下载文件名
            link.click()
        } catch (error) {
            console.error(error)
        }
    }

    const openChange = async function (open: boolean) {
        try {
            if (!open || userInfo?.isLogin) {
                return;
            }
            setQrcodeStatus('loading');
            const response = await fetch('/api/login');
            const data = await response.json() as  { data: {url: string; qrcode_key: string} };
            setQrcode(data.data.url);
            setQrcodeStatus('active');
            const timer = setInterval(async () => {
                const loginInfoResponse = await fetch('/api/login', {
                    method: 'POST',
                    body: JSON.stringify({
                        qrcode_key: data.data.qrcode_key
                    }),
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    }
                });
                const loginInfoData = await loginInfoResponse.json() as {data: { code: number; refresh_token: string }};
                if (loginInfoData.data.code === 0) {
                    clearInterval(timer);
                    message.success('登录成功！');
                    const userInfoResponse = await fetch('/api/user');
                    const userInfoData = await userInfoResponse.json();
                    setUserInfo(userInfoData.data);
                    localStorage.setItem(LocalStorageKey, JSON.stringify(userInfoData.data));
                } else if (loginInfoData.data.code === 86038) {
                    setQrcodeStatus('expired');
                    clearInterval(timer);
                }
            }, 5000)
        } catch (e) {
            message.error(`${e}`);
        }
    }

    useEffect(() => {
        if (localStorage.getItem(LocalStorageKey)) {
            fetch('/api/user')
                .then(response => response.json())
                .then(data => {
                    setUserInfo(data.data);
                    localStorage.setItem(LocalStorageKey, JSON.stringify(data.data))
                })
                .catch(error => {
                    message.error(`${error}`);
                    console.error(error);
                });
        }
    }, [])

    return (
        <Drawer title="设置" placement="right" afterOpenChange={openChange} onClose={drawerOnClose} open={open} width={400}>
            {userInfo?.isLogin ?
                <>
                    <Title level={5}>用户信息</Title>
                    <Row justify="center" style={{marginBottom: '12px'}}>
                        <Avatar size={64} src={userInfo.face} />
                    </Row>
                    <Descriptions column={2}>
                        <Descriptions.Item label="用户名">{userInfo.uname}</Descriptions.Item>
                        <Descriptions.Item label="用户 mid">{userInfo.mid}</Descriptions.Item>
                        <Descriptions.Item label="硬币数">{userInfo.money}</Descriptions.Item>
                        <Descriptions.Item label="用户等级">{userInfo.level_info.current_level}</Descriptions.Item>
                    </Descriptions>
                </>
                :
                <>
                    <Title level={5}>账户登录</Title>
                    <Row className={styles.row} justify="center">
                        <QRCode value={qrcode} size={200} status={qrcodeStatus} onRefresh={() => openChange(true)}/>
                    </Row>
                </>
            }
            <Divider/>
            <Title level={5}>配置管理</Title>
            <Row className={styles.row}>
                <Col span={8}>
                    <Upload {...props}>
                        <Button>导入配置</Button>
                    </Upload>
                </Col>
                <Col span={8}>
                    <Button onClick={exportConfig} disabled={!nextInvocationTime}>
                        导出配置
                    </Button>
                </Col>
            </Row>
        </Drawer>
    )
}